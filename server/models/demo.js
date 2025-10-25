const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true }
});

module.exports = mongoose.model("demo", demoSchema);
