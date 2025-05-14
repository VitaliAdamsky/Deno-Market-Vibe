import { Request, Response } from "npm:express@4.18.2";
import { logger } from "../grant-utils/servants/operators/logger.ts";

export async function getNetworkInterfacesController(
  _req: Request,
  res: Response
) {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const networkInterfaces = await Deno.networkInterfaces();
    return res.json({ networkInterfaces, publicIp: data.ip });
  } catch (error) {
    logger.error("❌ Error in deleteAllErrorMessagesController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
