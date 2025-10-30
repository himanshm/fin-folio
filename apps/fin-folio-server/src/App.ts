import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application as ExpressApp } from "express";
import helmet from "helmet";
import http from "http";
import config from "./config";
import { AppDataSource } from "./data-source";
import { errorHandler, notFoundHandler, requestContext } from "./middlewares";
import {
  handleServerError,
  logger,
  normalizePort,
  onServerListen
} from "./utils";

class Application {
  public app: ExpressApp;
  private server?: http.Server;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.registerRoutes();
    this.registerErrorHandlers();
  }

  private isDevMode() {
    return process.env.NODE_ENV === "development";
  }

  private configureMiddleware() {
    this.app.use(
      cors({
        origin: config.app?.auth?.clientUrl,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
      })
    );

    if (this.isDevMode()) {
      this.app.use(helmet());
    } else {
      this.app.use(helmet()); // TODO: Customize helmet for production
    }
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(requestContext);
  }

  private registerRoutes() {
    // Register routes here
  }

  private registerErrorHandlers() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
  public async init(): Promise<void> {
    try {
      await AppDataSource.initialize();
      logger.info("✅ Database connection established successfully");
    } catch (error) {
      logger.error(`❌ Database initialization failed:, ${error}`);
      process.exit(1);
    }

    // Test: Create a new user
    // const user = new User();
    // user.name = "Temba";
    // user.email = "lauren-bell@noemail.com";
    // user.password = "lauren@123";
    // user.country = "UK";
    // user.currency = "GBP";

    // try {
    //   // const newUser = await AppDataSource.manager.save(user);
    //   // console.log('New user: ', newUser);
    //   // console.log('User created successfully');
    //   const lastUser = await AppDataSource.manager.findOneBy(User, {
    //     email: "lauren-bell@noemail.com"
    //   });
    //   const isPasswordValid = await lastUser?.isPasswordValid("lauren@1234");
    //   console.log("Is password valid: ", isPasswordValid);
    // } catch (error) {
    //   console.error(error);
    // }
  }

  public start(): void {
    const port = normalizePort(String(config.app?.port ?? 8081));
    if (port === false) {
      logger.error("Invalid port specified");
      process.exit(1);
    }

    this.app.set("port", port);

    this.server = http.createServer(this.app);

    this.server.listen(port);

    this.server.on("error", error => handleServerError(error, port));
    this.server.on("listening", () => onServerListen(this.server!));

    // Graceful shutdown
    process.on("SIGINT", () => this.shutdown());
    process.on("SIGTERM", () => this.shutdown());
  }

  private async shutdown(): Promise<void> {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info("🧹 Database connections closed cleanly");
      }
      this.server?.close(() => {
        logger.info("🛑 Server shut down gracefully");
        process.exit(0);
      });
    } catch (error) {
      logger.error(`Error during shutdown", ${error}`);
      process.exit(1);
    }
  }
}

export default Application;
