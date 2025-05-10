import express, { Application } from "npm:express@4.18.2";
import cors from "npm:cors";

import { ServantsConfig } from "../grant-utils/servants/models/servants-config.ts";

const initializeApp = (config: ServantsConfig) => {
  const allowedOrigins = config.allowedOrigins;

  if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
    throw new Error("No valid allowed origins found in the configuration");
  }
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: [...allowedOrigins.filter(Boolean)], // Ensure no falsy values
    })
  );

  // app.use("/api", oiRoutes);
  // app.use("/api", errorsRoutes);
  // app.use("/api", generalRoutes);

  return app;
};

export default initializeApp;
