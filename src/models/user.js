const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    access_level: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', UserSchema);