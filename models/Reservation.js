const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    catwayId: { 
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'Catway',
        required: true 
    },
    catwayNumber: {
        type: Number,
        required: true,
        index: true
    },
    clientName: {
        type: String,
        required: true
    },
    boatName: {
        type: String,
        require: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);