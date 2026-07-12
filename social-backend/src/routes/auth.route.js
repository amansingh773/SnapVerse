const express = require("express")
const router = express.Router()
const { OTP } = require("../models/otp.model")
const { VerifiedMail } = require("../models/verifiedMails.model")
const { Resend } = require("resend")
const resend = new Resend(process.env.RESEND_API_KEY)
const validator = require("validator")
const { User } = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



router.post("/send-otp", async(req, res) => { // ratelimit

    try {
        const{ email } = req.body // cfghsdjfkg
       

        await VerifiedMail.deleteOne({email})


        if(!validator.isEmail(email))
        {
            throw new Error("Please enter a valid email...")
        }

       var genOtp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0")
        

        const createdOtp = await OTP.create({
            email,
            otp : genOtp
        })

        await resend.emails.send({
            from: "Shubham <shubham@noisy.co.in>",
            to: email,
            subject: "OTP Verification",
            html: `
                <div style="
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 24px;
                font-family: Arial, Helvetica, sans-serif;
                color: #1f2937;
                line-height: 1.6;
                ">
                <h2 style="
                    margin: 0 0 24px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #111827;
                ">
                    Verify your email
                </h2>

                <p style="margin: 0 0 16px;">
                    Hi,
                </p>

                <p style="margin: 0 0 24px;">
                    Use the verification code below to continue. This code will expire shortly.
                </p>

                <div style="
                    margin: 32px 0;
                    padding: 16px 24px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    display: inline-block;
                ">
                    <span style="
                    font-size: 32px;
                    letter-spacing: 8px;
                    font-weight: 700;
                    color: #111827;
                    ">
                    ${genOtp}
                    </span>
                </div>

                <p style="
                    margin: 24px 0 0;
                    font-size: 14px;
                    color: #6b7280;
                ">
                    If you didn't request this code, you can safely ignore this email.
                </p>

                <hr style="
                    margin: 32px 0;
                    border: none;
                    border-top: 1px solid #e5e7eb;
                ">

                <p style="
                    margin: 0;
                    font-size: 13px;
                    color: #9ca3af;
                ">
                    Sent by Noisy
                </p>
                </div>
            `
        })


        res.status(201).json({
            success : true
        })
    } catch (error) {
        res.status(400).json({
            err : error.message,
            test : "OK"
        })
    }

   
})


router.post("/verify-otp", async(req, res) => {
    try {
        const{email, otp} = req.body

        const foundOtp = await OTP.findOne({
            email, otp
        })

        if(!foundOtp)
        {
            throw new Error("Invalid OTP, please try again!")
        }

        await VerifiedMail.create({email})

        res.status(201).json({
            success : true,
            msg : "E-Mail verified, please sign up now.."
        })

    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})


router.post("/signup", async(req, res) => {
    try {
        const{ email, username, password} = req.body

        if(!email || !username || !password)
        {
            throw new Error("Please enter all the fields..")
        }

        if(!validator.isEmail(email))
        {
            throw new Error("Please enter a valid email..")
        }

        if(!validator.isStrongPassword(password))
        {
            throw new Error("Please enter a strong password")
        }

        if(username.length < 2 || username.length > 12)
        {
            throw new Error("Username must be 2-12 characters")
        }

        const foundMail = await VerifiedMail.findOne({email})

        if(!foundMail)
        {
            throw new Error("Please verify your mail first..")
        }


        const hashedPassword = await bcrypt.hash(password, 11)
        // console.log(hashedPassword)

        const createdUser = await User.create({email, password : hashedPassword, username})

        res.status(201).json({
            success : true,
            msg : "User created successfully",
            // data : createdUser
        })



    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})


router.post("/login", async(req, res) => {
    try {
        const{ email, username, password } = req.body

        // const foundUser = await User.findOne({
        //     $and : [
        //         {password},
        //         {
        //             $or : [
        //                 {email},
        //                 {username}
        //             ]
        //         }
        //     ]
        // })

        
        const foundUser = await User.findOne({
            $or : [
                {email},
                {username}
            ]
        }).populate("posts following followers")



        if(!foundUser)
        {
            throw new Error("User does not exist..")
        }


        const isPwCorrect = await bcrypt.compare(password, foundUser.password)

        // console.log("OK", isPwCorrect)


        if(!isPwCorrect)
        {
            throw new Error("Invalid Credentials..")
        }

        const token = await jwt.sign({id : foundUser._id}, process.env.JWT_SECRET, {expiresIn : "1d"})


res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
}).status(200).json({
    success: true,
    msg: "User Logged In",
    data: {
        _id: foundUser._id,
        email: foundUser.email,
        username: foundUser.username,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        bio: foundUser.bio,
        gender: foundUser.gender,
        dateOfBirth: foundUser.dateOfBirth,
        displayPicture: foundUser.displayPicture,
        followers: foundUser.followers,
        following: foundUser.following,
        posts: foundUser.posts,
        isCompletedProfile: foundUser.isCompletedProfile
    }
});

    } catch (error) {
        res.status(404).json({
            err : error.message
        })
    }
})


router.post("/logout", async(req, res) => {
    try {
        res.status(200).cookie("token", "").json({
            success : true,
            msg : "User logged out.."
        })
    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})

router.get("/get-user-data", async(req, res) => {
    try {
        const {token} = req.cookies
        const obj = jwt.decode(token, process.env.JWT_SECRET)
        const foundUser = await User.findById(obj.id)
        .populate("following", "username displayPicture firstName lastName") 
        .populate({
            path: "posts",
            populate: {
            path: "comments",
            populate: {
            path: "authorId",
            select: "username displayPicture firstName lastName"
        }
    }
        })

        if(!foundUser)
        {
            throw new Error("User logged out, please log in again..")
        }

        res.status(200).json({
            success : true, 
            data : {
                _id : foundUser._id,  
                email : foundUser.email,
                username : foundUser.username,
                firstName : foundUser.firstName,
                lastName : foundUser.lastName,
                bio : foundUser.bio,
                gender : foundUser.gender,
                dateOfBirth : foundUser.dateOfBirth,
                displayPicture : foundUser.displayPicture,
                followers : foundUser.followers,
                following : foundUser.following,
                posts : foundUser.posts,
                isCompletedProfile : foundUser.isCompletedProfile

            }
        })


    } catch (error) {
        res.status(404).json({
            err : error.message
        })
    }

})


module.exports = {
    authRouter : router
}