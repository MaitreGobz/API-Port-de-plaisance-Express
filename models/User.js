const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);