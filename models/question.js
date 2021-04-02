const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    isAnonymous: Boolean,
    whoAsked: {type: Schema.Types.ObjectId, ref: "User" },
    user: {type: Schema.Types.ObjectId, ref: "User" },
    content: String, 
    isAnswered: { type: Boolean, default: false },
    answer: String,
    likes: {
        byWho: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        count: {type: Number, default: 0}
    },
    date: {type: Schema.Types.Date, default:Date.now }
})

module.exports = mongoose.model("Question", questionSchema);