import mongoose from 'mongoose';

const seatDataSchema = new mongoose.Schema({
    seatname: {
        type: String,
        required: true,
    },
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

export default SeatData;