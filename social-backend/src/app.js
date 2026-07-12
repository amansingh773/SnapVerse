require("dotenv").config()
const express = require("express")
const app = express()
const dns = require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"])
const mongoose = require("mongoose")
const cp = require("cookie-parser")
const { authRouter } = require("./routes/auth.route")
const { profileRouter } = require("./routes/profile.route")
const { postRouter } = require("./routes/post.route")
const http = require("http")
const fn = require("socket.io")
const { Chat }  = require("./models/chat.model")

const {commentRouter} = require("./routes/comment.route")

const PORT = process.env.PORT || 8080
const cors = require("cors")
const { send } = require("process")
const { chatRouter } = require("./routes/chat.route")


app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(cp())
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/profile", profileRouter)
app.use("/api/post", postRouter)
app.use("/api/comment", commentRouter)
app.use("/api/chats", chatRouter)

app.use((req, res) => {
    res.status(404).json({
        err : "Not found"
    })
})



const server = http.createServer(app)
const io = fn(server, {
    cors : {
        origin : [process.env.FRONTEND_URL],
    }
})


io.on("connection", (socket) => {
  socket.on("join-room", ({ sender, receiver }) => {
    if (!sender || !receiver) return;

    const roomId = [sender.trim(), receiver.trim()].sort().join("");
    socket.join(roomId);
  });

  socket.on("send-msg", async ({ text, sender, receiver }) => {
    const roomId = [sender.trim(), receiver.trim()].sort().join("");

    await Chat.create({
      senderId: sender,
      receiverId: receiver,
      text,
    });

    io.to(roomId).emit("receive-msg", {
      text,
      sender,
    });
  });
});




mongoose.connect(process.env.MONGO_URL)
.then(() => {

    console.log("DB Connected...")
    
    
    server.listen(PORT, () => {
        console.log("Server Running on PORT", PORT)
    })

})




