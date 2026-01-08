import mongoose from 'mongoose';

const seatDataSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true,
    },
    isBooked: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const SeatData = mongoose.model('SeatData', seatDataSchema, 'SeatData');