import express from "npm:express@4.18.2";
import {
  getAllErrorMessagesController,
  deleteAllErrorMessagesController,
} from "../controllers/errors.controller.ts";

const router = express.Router();

// Route to get all error messages in descending order by timestamp
router.get("/errors", getAllErrorMessagesController);

// Route to delete all error messages
router.get("/errors/delete", deleteAllErrorMessagesController);

export default router;
