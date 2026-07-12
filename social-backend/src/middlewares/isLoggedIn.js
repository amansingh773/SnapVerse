const jwt = require("jsonwebtoken")
const { User } = require("../models/user.model")

const isLoggedIn = async(req, res, next) => {
    try {
        const{ token } = req.cookies

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const foundUser = await User.findById(decoded.id).populate("posts")

        if(!foundUser)
        {
            throw new Error("Please log in first..")
        }
        req.user = foundUser
        next()
    } catch (error) {
        res.json({
            err : error.message,
        })
    }
}


module.exports = {
    isLoggedIn
}