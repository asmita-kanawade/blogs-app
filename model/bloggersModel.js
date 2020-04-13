const mongoose = require('mongoose');

const bloggersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Bloggers',bloggersSchema, `bloggers`);