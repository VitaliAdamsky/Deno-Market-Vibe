import { Request, Response } from "npm:express@4.18.2";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { readAllErrorReports } from "../grant-utils/errors/read-all-error-repots.ts";
import { deleteAllErrorReports } from "../grant-utils/errors/deletea-all-error-repots.ts";

// Function to get all error messages in descending order by timestamp
export async function getAllErrorMessagesController(
  _req: Request,
  res: Response
) {
  try {
    const errorReports = await readAllErrorReports();
    errorReports.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return res.json(errorReports);
  } catch (error) {
    logger.error("❌ Error in getAllErrorMessagesController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Function to delete all error messages
export async function deleteAllErrorMessagesController(
  _req: Request,
  res: Response
) {
  try {
    await deleteAllErrorReports();
    return res.json({ message: "All error messages have been deleted." });
  } catch (error) {
    logger.error("❌ Error in deleteAllErrorMessagesController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
