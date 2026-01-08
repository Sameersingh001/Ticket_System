import express from "express";
import { addSeat, getSeats, bookSeat } from "../controller/SeatControllers.js";
import { verifyToken } from "../middleware/verifyToten.js"; 

const router = express.Router();

router.post("/seats/add", addSeat);
router.put("/seats/:seatId", bookSeat);
router.get("/seats", getSeats);

export default router;