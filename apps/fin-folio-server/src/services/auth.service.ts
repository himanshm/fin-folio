import config from "@/config";
import { AppDataSource } from "@/data-source";
import { User } from "@/models/User";
import { UserRepository, UserSessionRepository } from "@/repositories";
import {
  AppAuth,
  RegisterUserCredentials,
  SignInUserCredentials
} from "@/types";
import {
  AuthenticationError,
  ValidationError,
  generateAccessToken,
  generateRefreshToken,
  logger,
  runTransaction,
  verifyRefreshToken
} from "@/utils";
import bcrypt from "bcrypt";
import { DataSource, EntityManager } from "typeorm";

const ACCESS_TOKEN_EXPIRY_MINUTES = config.app?.auth
  ?.accessTokenExpiry as number;
const REFRESH_TOKEN_EXPIRY_DAYS = config.app?.auth
  ?.refreshTokenExpiry as number;

export const createAuthService = (
  dataContext: EntityManager | DataSource = AppDataSource
) => {
  const userRepository = new UserRepository(dataContext);
  const sessionRepository = new UserSessionRepository(dataContext);

  const hashToken = async (token: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(token, salt);
  };

  const createSession = async (
    user: User,
    refreshToken: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<void> => {
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    await sessionRepository.createAndSave({
      user,
      tokenHash,
      deviceInfo,
      ipAddress,
      expiresAt,
      lastUsedAt: new Date()
    });
  };

  const generateTokens = async (
    userId: string | number,
    tokenVersion: number
  ) => {
    const accessToken = generateAccessToken(userId, {
      expiresIn: `${ACCESS_TOKEN_EXPIRY_MINUTES}m`
    });

    const refreshToken = generateRefreshToken(userId, tokenVersion, {
      expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`
    });

    return { accessToken, refreshToken };
  };

  const registerUser = async (
    credentials: RegisterUserCredentials,
    auth: AppAuth
  ) => {
    const execute = async (manager: EntityManager) => {
      const txnUserRepo = new UserRepository(manager);

      const { name, email, password } = credentials;
      const { ipAddress, deviceInfo } = auth;

      if (!name || !email || !password) {
        throw new ValidationError("Name, email and password are required");
      }

      const existingUser = await txnUserRepo.findOne({ where: { email } });
      if (existingUser) {
        throw new ValidationError("User with this email already exists");
      }

      const user = await txnUserRepo.createAndSave({ name, email, password });

      const { accessToken, refreshToken } = await generateTokens(
        user.id,
        user.refreshTokenVersion
      );

      await createSession(user, refreshToken, deviceInfo, ipAddress);
      logger.info({ userId: user.publicId }, "🧩 User registered successfully");
      return { user, tokens: { accessToken, refreshToken } };
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext)
      : runTransaction({ label: "Register User" }, execute);
  };

  const signInUser = async (
    credentials: SignInUserCredentials,
    auth: AppAuth
  ) => {
    const { email, password } = credentials;
    const { ipAddress, deviceInfo } = auth;

    const user = await userRepository.findOneByEmailForAuth(email);
    if (!user) {
      throw new AuthenticationError("Invalid credentials-email");
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials-password");
    }

    const { accessToken, refreshToken } = await generateTokens(
      user.id,
      user.refreshTokenVersion
    );

    await createSession(user, refreshToken, deviceInfo, ipAddress);
    return { user, tokens: { accessToken, refreshToken } };
  };

  const refreshToken = async (oldRefreshToken: string, auth: AppAuth) => {
    const execute = async (manager: EntityManager) => {
      const txnUserRepo = new UserRepository(manager);
      const txnSessionRepo = new UserSessionRepository(manager);

      if (!oldRefreshToken) {
        throw new AuthenticationError("Refresh token is required");
      }
      const { ipAddress, deviceInfo } = auth;

      const decoded = verifyRefreshToken(oldRefreshToken);
      if (!decoded) throw new AuthenticationError("Invalid refresh token");

      const user = await txnUserRepo.findOneByPublicIdForAuth(decoded.userId);
      if (!user || user.refreshTokenVersion !== decoded.tokenVersion) {
        throw new AuthenticationError("Invalid user or session");
      }

      const session = await txnSessionRepo.findOneByUserIdForAuth(user.id);
      if (!session) throw new AuthenticationError("Session not found");

      const valid = await session.isTokenValid(oldRefreshToken);
      if (!valid) throw new AuthenticationError("Invalid refresh token");

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens(user.id, user.refreshTokenVersion);

      session.tokenHash = await hashToken(newRefreshToken);
      session.lastUsedAt = new Date();
      session.ipAddress = ipAddress;
      session.deviceInfo = deviceInfo;
      session.expiresAt = new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      );
      await txnSessionRepo.save(session);

      return { tokens: { accessToken, refreshToken: newRefreshToken } };
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext)
      : runTransaction({ label: "Refresh Token" }, execute);
  };

  const signOutUser = async (sessionId: string) => {
    const execute = async (manager: EntityManager) => {
      const txnUserRepo = new UserRepository(manager);
      const txnSessionRepo = new UserSessionRepository(manager);

      const session = await txnSessionRepo.findOneBySessionIdForAuth(sessionId);
      if (!session) throw new AuthenticationError("Session not found");

      const user = session.user;

      session.revoked = true;
      await txnSessionRepo.save(session);

      await txnUserRepo.updateById(user.id, {
        refreshTokenVersion: user.refreshTokenVersion + 1
      });
      logger.info({ userId: user.publicId }, "🧩 User signed out successfully");
      return { success: true };
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext)
      : runTransaction({ label: "Sign Out User" }, execute);
  };

  const signOutAllSessions = async (userId: string) => {
    const execute = async (manager: EntityManager) => {
      const txnUserRepo = new UserRepository(manager);
      const txnSessionRepo = new UserSessionRepository(manager);

      const user = await txnUserRepo.findOneByPublicIdForAuth(userId);
      if (!user) throw new AuthenticationError("User not found");

      const sessions = await txnSessionRepo.findAllActiveByUserIdForAuth(
        user.id
      );
      if (!sessions.length) throw new AuthenticationError("Sessions not found");
      for (const session of sessions) {
        session.revoked = true;
        await txnSessionRepo.save(session);
      }
      logger.info(
        { userId: user.publicId },
        "🧩 All sessions signed out successfully"
      );
      return { success: true };
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext)
      : runTransaction({ label: "Sign Out All Sessions" }, execute);
  };

  return {
    registerUser,
    signInUser,
    refreshToken,
    signOutUser,
    signOutAllSessions
  };
};
