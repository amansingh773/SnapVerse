const express = require("express")
const router = express.Router()
const validator = require("validator")
const { User } = require("../models/user.model")
const { isLoggedIn } = require("../middlewares/isLoggedIn")


router.put("/complete",isLoggedIn, async(req, res) => {
    try {
        const{firstName, lastName, dateOfBirth, gender, displayPicture, bio} = req.body
       
        const foundUser = req.user

        if(!firstName || !lastName || !dateOfBirth || !gender)
        {
            throw new Error("Firstname, lastname, gender and DOB are required..")
        }

        if(!validator.isDate(dateOfBirth))
        {
            throw new Error("Invalid Date")
        }

        
        foundUser.firstName = firstName;
        foundUser.lastName = lastName;
        foundUser.bio = bio;
        foundUser.gender = gender;
        foundUser.dateOfBirth = dateOfBirth;
        foundUser.displayPicture = displayPicture;
        foundUser.isCompletedProfile = true;

        await foundUser.save()




        res.status(200).json({
            success : true, 
            msg : "Profile updated",
            data : {
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
            }
        })


    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})

router.patch("/edit", isLoggedIn ,async(req, res) => {
    try {
        const{ firstName, lastName, bio } = req.body



        const loggedInUser = req.user

        loggedInUser.firstName = firstName
        loggedInUser.lastName = lastName
        // loggedInUser.displayPicture = displayPicture
        loggedInUser.bio = bio

        await loggedInUser.save()

        res.status(200).json({
            success : true,
            msg : "Profile Updated...",
            data : {
                email : loggedInUser.email,
                username : loggedInUser.username,
                firstName : loggedInUser.firstName,
                lastName : loggedInUser.lastName,
                bio : loggedInUser.bio,
                gender : loggedInUser.gender,
                dateOfBirth : loggedInUser.dateOfBirth,
                displayPicture : loggedInUser.displayPicture,
                followers : loggedInUser.followers,
                following : loggedInUser.following,
                posts : loggedInUser.posts,
                isCompletedProfile : loggedInUser.isCompletedProfile
            }
        })
        

    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})

router.patch("/edit/dp", isLoggedIn, async(req, res) => {
    try {
        const{displayPicture} = req.body
        console.log(displayPicture)

        if(!validator.isURL(displayPicture))
        {
            throw new Error("Please provide a valid picture")
        }

        const loggedInUser = req.user
        loggedInUser.displayPicture = displayPicture
        await loggedInUser.save()

        res.json({
            success : true,
            msg : "Profile Picture updated..",
            data : {
                email : loggedInUser.email,
                username : loggedInUser.username,
                firstName : loggedInUser.firstName,
                lastName : loggedInUser.lastName,
                bio : loggedInUser.bio,
                gender : loggedInUser.gender,
                dateOfBirth : loggedInUser.dateOfBirth,
                displayPicture : loggedInUser.displayPicture,
                followers : loggedInUser.followers,
                following : loggedInUser.following,
                posts : loggedInUser.posts,
                isCompletedProfile : loggedInUser.isCompletedProfile
            }
        })

        // console.log("OK")

    } catch (error) {
        res.status(400).json({
            err : error.message
        })
    }
})

router.patch("/follow/:userId",isLoggedIn,async(req,res)=>{
    try 
    {
        const {userId} = req.params
        const foundUser = req.user

        const targetUser = await User.findById(userId)

        if(!targetUser)
        {
            throw new Error("User not found")
        }

        if(targetUser._id.toString() == foundUser._id.toString())
        {
            throw new Error("You cannot follow yourself")
        }
        const alreadyFollowing = foundUser.following.some(user => user.toString() == userId)

        if(alreadyFollowing)
        {
            foundUser.following = foundUser.following.filter((user)=>{
                return user.toString() !== userId
            })

            targetUser.followers = targetUser.followers.filter((user)=>{
                return user.toString() !== foundUser._id.toString()
            })

            await foundUser.save()
            await targetUser.save()

            return  res.status(200).json({
                success : true,
                msg : "User unfollowed Successfully"
            })
        }
        foundUser.following.push(targetUser._id)
        targetUser.followers.push(foundUser._id)

        await foundUser.save()
        await targetUser.save()

        res.status(200).json({
            success : true,
            msg : "user followed Successfully"
        })


    } 
    catch (error) 
    {
        res.status(400).json({
            success : false,
            msg : error.message
        })
    }
})

router.get("/search", isLoggedIn, async (req, res) => {
    try {
            const {query, skip} = req.query
            const foundUser = req.user

            if(!query || query.trim() === "")
            {
                return res.status(200).json({
                    sucess : true,
                    data : []
                })
            }
            const users = await User.find({
                username : {$regex : query, $options : "i"},
                _id : {$ne : foundUser.id} 
            })
            .select("username firstName lastName displayPicture _id")
            .limit(5)
            .skip(skip)

            res.status(200).json({
                sucess : true,
                msg: "Users fetched",
                data: users
            })


    } catch (error) {
            res.status(400).json({
            err: error.message
        })
    }


})

router.get("/:id", isLoggedIn, async(req, res) => {
    try {
        const {id} = req.params
        const foundUser = req.user

        const user = await User.findById(id)
        .select("username firstName lastName dateOfBirth followers following posts displayPicture bio ")
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

        if(!user)
        {
            throw new Error("User not found")
        }

         const isFollowing = user.followers.some(
            (followerId) => followerId.toString() === foundUser.id
        )

        res.status(200).json({
            success: true,
            data : {
                ...user.toObject(),
                isFollowing
            }
        })
    } catch (error) {
         res.status(404).json({
            err: error.message
        })
    }
})

module.exports = {
    profileRouter : router
}