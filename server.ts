import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import express from "npm:express";

import { TF } from "./models/timeframes.ts";
import { KlineDataRepo } from "./global/kline-data-repo.ts";

const env = await load();

const app = express();
const PORT = env.PORT || 80;

// First, do all async initializations
async function bootstrap() {
  try {
    await KlineDataRepo.initialize({
      [TF.h1]: env["KLINE_1H_URL"],
      [TF.h4]: env["KLINE_4H_URL"],
      [TF.D]: env["KLINE_D_URL"],
    });

    // ✅ GET endpoint to fetch Kline data for a given timeframe
    app.get("/kline/:timeframe", (req: any, res: any) => {
      const tfParam = req.params.timeframe;

      // Map string param to enum value
      const timeframe = TF[tfParam as keyof typeof TF];
      if (!timeframe || !Object.values(TF).includes(timeframe)) {
        return res.status(400).json({ error: "Invalid timeframe" });
      }

      try {
        const data = KlineDataRepo.getData(timeframe);
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: err });
      }
    });

    // Then start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize app:", err);
    Deno.exit(1); // Ensure you stop app startup on failure
  }
}

bootstrap();
