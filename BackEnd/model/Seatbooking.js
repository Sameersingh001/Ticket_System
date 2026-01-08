import mongoose from "mongoose";

const seatBookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SeatData',
        required: true,
    },
}, { timestamps: true });

const SeatBooking = mongoose.model('SeatBooking', seatBookingSchema, 'SeatBookings');