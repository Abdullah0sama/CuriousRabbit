const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    anonymous: Boolean,
    whoAsked: {type: Schema.Types.ObjectId, ref: "User" },
    user: {type: Schema.Types.ObjectId, ref: "User" },
    content: String, 
    isAnswered: { type: Boolean, default: false },
    answer: String
})

module.exports = mongoose.model("Question", questionSchema);