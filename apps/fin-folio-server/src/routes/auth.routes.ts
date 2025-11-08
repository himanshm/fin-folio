import {
    getCurrentUser,
    logoutUser,
    refreshToken,
    registerUser,
    signInUser
} from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares";
import express, { type Router } from "express";

const authRouter: Router = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", signInUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.get("/current-user", authenticate, getCurrentUser);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
