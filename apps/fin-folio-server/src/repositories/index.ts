import { AppDataSource } from "@/data-source";
import { UserSessionRepository } from "./session.repository";
import { UserRepository } from "./user.repository";

// Export classes for use in services that need to create instances with custom contexts
export { UserRepository, UserSessionRepository };

// Export singleton instances for use in controllers/middlewares (default DataSource)
const userRepository = new UserRepository(AppDataSource);
const userSessionRepository = new UserSessionRepository(AppDataSource);

export { userRepository, userSessionRepository };
