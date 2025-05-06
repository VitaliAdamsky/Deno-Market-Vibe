import express, { Application } from "npm:express@4.18.2";
import cors from "npm:cors";
// import { Config } from "../models/config.ts";
// import generalRoutes from "../routes/general.routes.ts";
const initializeApp = (): Promise<Application> => {
  // const allowedOrigins = config.ALLOWED_ORIGINS;

  // if (!Array.isArray(allowedOrigins) || allowedOrigins.length === 0) {
  //   throw new Error("No valid allowed origins found in the configuration");
  // }
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      // origin: [...allowedOrigins.filter(Boolean)], // Ensure no falsy values
    })
  );
  //app.use("/api", generalRoutes);

  return app;
};

export default initializeApp;
