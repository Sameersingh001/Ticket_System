import  Seat  from "../model/SeatData.js";
import Booking from "../model/Seatbooking.js";


export const addSeat = async (req, res) => {
  try {
    const { seatname, seatNumber, isBooked } = req.body;
    const newSeat = new Seat({ seatname, seatNumber, isBooked });
    await newSeat.save();
    res.status(201).json({ success: true, message: "Seat added successfully" });
    } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    console.log("ERROR" , error)
  }
}


export const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}


export const bookSeat = async (req, res) => {
  try {
    const { seatId, userId } = req.body;
    const seat = await Seat.findById(seatId);

    if (!seat) {
      return res.status(404).json({ success: false, message: "Seat not found" });
    }
    if (seat.isBooked) {
      return res.status(400).json({ success: false, message: "Seat already booked" });
    }
    seat.isBooked = true;
    await seat.save();
    const booking = new Booking({ seatId, userId });
    await booking.save();
    res.status(200).json({ success: true, message: "Seat booked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    console.log("error", error)
  } 

}