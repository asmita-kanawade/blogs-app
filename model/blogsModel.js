const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Blogs',blogsSchema, `blogs`);