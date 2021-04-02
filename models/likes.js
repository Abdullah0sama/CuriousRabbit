const mongoose  = require("mongoose");
const Schema    = mongoose.Schema;

const likesSchema = new Schema({
    question    : {type: Schema.Types.ObjectId, ref: 'Question'}, 
    user        : {type: Schema.Types.ObjectId, ref: 'User'}
});

likesSchema.index({question:1, user:1});

module.exports = mongoose.model('Like', likesSchema);