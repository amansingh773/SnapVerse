const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption : {
        type : String,
        maxLength : 100,
        trim : true
    },
    imageUrl : {
        type : String,
        required : true,
        trim : true
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User",
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment",
    }]

}, {timestamps : true})

const Post = mongoose.model("Post", postSchema)

module.exports = {
    Post
}