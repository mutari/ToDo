const bcrypt = require('bcryptjs')
const ObjectID = require('mongodb').ObjectID
const converter = require('../modules/frameConverter')

module.exports = {
    postLogin: async (req, res) => {// självklart kommer lösenord kontrol och så vidare
        try {
            let data = {} // i data objektet ska både user data samt frame data och hash data 
        
            //get user data
            let user = await req.db.userCol.findOne({"email": req.body.email})
            if (user) data.user = user
            else return res.json({message: "Could not find a user white that email in the database", status: 400})

            let frame = await req.db.frameCol.findOne({"_id": user.selected_frame})
            if (frame) data.frame = frame
            else {
                data.frame = require('../dataSchema/new_frame')
                data.frame.members.push(ObjectID(user._id))
                data.frame.author = ObjectID(user._id)
                data.user.selected_frame = (await req.db.frameCol.insertOne(data.frame))["ops"][0]["_id"]
                if(!data.user.selected_frame)
                    return res.json({message: "frame could not be created", status: 400})
                data.user.frames.push({id: data.user.selected_frame, title: data.frame.title})
                let respons = await req.db.userCol.updateOne({email: req.body.email}, {$set: {selected_frame: data.user.selected_frame, frames: data.user.frames}})
                data.frame = converter.ConvertToOldFrameLayout(data.frame)
                if(!respons)
                    return res.json({message: "user could not be updatetd", status: 400})
            }
            data.token = req.token
            console.log(data.token)
            res.cookie("tokenSecure",req.tokenSecure,{httpOnly:true,sameSite:"Strict"});
            return res.json({...data, status: 200})
        } catch (error) {
            console.error(error)
            return res.json({message: "sign in error", status: 400})
        }
    },
    postSignUp: async (req, res) => {
        try {
            bcrypt.hash(req.body.password, 12, async (err, hash) => {
                delete req.body.password
                req.body.hash = hash
                req.body.frames = []
                let result = await req.db.userCol.insertOne(req.body)
                if(result) res.redirect(307, '/ToDo/login')
                else return res.json({message: "problem inserting into the database", status: 400})
            }) 
        } catch (error) {
            console.log(error)
            res.json({message: "sign upp error", status: 500})
        }
    },
    postGetUser: async (req, res) => {
        try {
            let data = {}

            let user = await req.db.userCol.findOne({"_id": ObjectID(req.token.id)})
            if(user) data.user = user;
            else return res.json({message: "could not fin user", status: 400})

            let frame = await req.db.frameCol.findOne({"_id": ObjectID(user.selected_frame)})
            if(frame) data.frame = converter.ConvertToOldFrameLayout(frame);
            else return res.json({message: "could not fin frame", status: 400})

            return res.json({...data, status: 200})
        } catch (error) {
            console.error(error)
            return res.json({message: "get user data error", status: 400})
        }
    },
    postUpdateUser: async (req, res) => {
        try {
            let user = await req.db.userCol.updateOne({"_id": ObjectID(req.token.id)}, {"$set": req.body})

            if(user) return res.json({message: "user updated", status: 200})
            return res.json({message: "User did not update", status: 400})
        } catch (error) {
            console.error(error)
            return res.json({message: "update user data error", status: 400})
        }
    },
    postDeleteUser: async (req, res) => {
        try {
            let respons = req.db.userCol.removeOne({"_id": ObjectID(req.token.id)})
            if(respons) return res.json({message: "user removed", status: 200})
            return res.json({message: "User did not get removed", status: 400})
        } catch (error) {
            console.error(error)
        }
    }
}