import express from "npm:express@4.18.2";
import { getNetworkInterfacesController } from "../controllers/general.controller.ts";

const router = express.Router();

router.get("/deno", getNetworkInterfacesController);

export default router;
