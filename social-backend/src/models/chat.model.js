
const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true,
        trim : true
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
})


const Chat = mongoose.model("Chat", chatSchema)
module.exports = {
    Chat
}