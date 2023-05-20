const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: 'https://i.ibb.co/176z8y8/Prox-logo-white.png' },
    role: { type: String, default: 'user' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
