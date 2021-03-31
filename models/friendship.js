const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const FriendshipSchema = new Schema({
    followed: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    follower: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}
});

FriendshipSchema.index({follower:1, followed:1});

module.exports = mongoose.model('Friendship', FriendshipSchema);