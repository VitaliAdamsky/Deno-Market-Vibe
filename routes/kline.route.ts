import express from "npm:express@4.18.2";
import { getKlineDataController } from "../controllers/kline.controller.ts";

const router = express.Router();

router.get("/kline/:timeframe", getKlineDataController);

export default router;
