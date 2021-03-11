const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    anonymous: Boolean,
    user: {type: Schema.Types.ObjectId, ref: "User"},
    content: String, 
    answered: Boolean,
    answer: String
})

module.exports = mongoose.model("Question", questionSchema);