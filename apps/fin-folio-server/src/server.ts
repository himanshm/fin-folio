import Application from "./App";
import { logger } from "./utils";
// import { loadEnv } from './loadEnv';

// loadEnv();

(async () => {
  const appInstance = new Application();
  await appInstance.init();
  appInstance.start();
  logger.info("🚀 Application started successfully!");
})();
