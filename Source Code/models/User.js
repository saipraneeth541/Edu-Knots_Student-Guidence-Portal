const mongoose = require("mongoose");
// User Schema
let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    reg: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
});
const User = (module.exports = mongoose.model("user", userSchema));