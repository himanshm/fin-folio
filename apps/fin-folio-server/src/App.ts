import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application as ExpressApp } from "express";
import helmet from "helmet";
import http from "http";
import config from "./config";
import { AppDataSource } from "./data-source";
import {
  authenticate,
  errorHandler,
  httpLogger,
  notFoundHandler,
  requestContext
} from "./middlewares";
import authRouter from "./routes/auth.routes";
import budgetRouter from "./routes/budget.routes";
import categoryRouter from "./routes/category.routes";
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
        allowedHeaders: ["Content-Type", "Authorization", "x-session-id"]
      })
    );

    if (this.isDevMode()) {
      this.app.use(helmet());
    } else {
      this.app.use(helmet()); // TODO: Customize helmet for production
    }
    this.app.use(express.json());
    this.app.use(httpLogger);
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(requestContext);
    this.app.use("/app/api", authenticate);
  }

  private registerRoutes() {
    // Register routes here
    this.app.use("/api/v0/auth", authRouter);
    this.app.use("/app/api/v0/categories", categoryRouter);
    this.app.use("/app/api/v0/budgets", budgetRouter);
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
      logger.error(`Error during shutdown, ${error}`);
      process.exit(1);
    }
  }
}

export default Application;
