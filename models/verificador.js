// models/VerificationCode.js
const { Schema, model } = require("mongoose");
const VerificationCodeSchema = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, expires: '5m', default: Date.now }  // El código expira en 5 minutos
});

module.exports = model('VerificationCode', VerificationCodeSchema);
