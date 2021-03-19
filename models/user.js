const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true }, 
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    password: { type: String, required: [true, "Email is required"] },
    email: { type: String, required: true , unique: true }
})

module.exports = mongoose.model("User", userSchema);