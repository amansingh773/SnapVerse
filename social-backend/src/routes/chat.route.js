const express = require("express")
const { Chat } = require("../models/chat.model")
const { isLoggedIn } = require("../middlewares/isLoggedIn")
const router = express.Router()



router.get("/get-msgs/:id", isLoggedIn ,async(req, res) => {
    try {
        const{ id } = req.params

        // const foundMsgs = await Chat.find({
        //     senderId : req.user._id,
        //     receiverId : id
        // })

        const foundMsgs = await Chat.find({
            $or : [
                {
                    senderId : req.user._id,
                    receiverId : id
                },
                {
                    receiverId : req.user._id,
                    senderId : id
                },
            ]
        })

        res.status(200).json(foundMsgs)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            err : error.message
        })
    }
})





module.exports = {
    chatRouter : router
}