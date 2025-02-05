const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    text: String,
    subtext: String,
    username: String,
    jaime: Number,
    image: String
});

module.exports = mongoose.model('post', postSchema, 'post');