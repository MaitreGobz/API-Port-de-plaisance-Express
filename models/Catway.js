const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catwaySchema = new Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['long', 'short'],
        require: true
    },
    catwayState: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);