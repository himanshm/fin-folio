import dotenv from "dotenv";
import fs from "fs";
import path from "path";

export function loadEnv(): void {
  const envPath = path.resolve(process.cwd(), "../../.env");

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[dotenv] Loaded env from ${envPath}`);
  } else {
    console.warn(`[dotenv] No .env found at ${envPath}`);
  }
}
