const bcrypt = require('bcryptjs')
const ObjectID = require('mongodb').ObjectID

module.exports = {
    postLogin: async (req, res) => {// självklart kommer lösenord kontrol och så vidare
        let data = {} // i data objektet ska både user data samt frame data och hash data 
        
        //get user data
        let user = await req.db.userCol.findOne({"email": req.body.email})
        if (user) data.user = user
        else {res.json({message: "Could not find a user white that email in the database", status: 400}); return}

        //get frame data
        let frame = await req.db.frameCol.findOne({"_id": user.selected_frame})
        if (frame) data.frame = frame
        else data = await require('../modules/generateStartFrame.js')(req, user, data) //generates a new frame

        data.token = req.token
        console.log(data)

        res.json(data)
    },
    postSignUp: async (req, res) => {
        try {
            bcrypt.hash(req.body.password, 12, async (err, hash) => {
                delete req.body.password
                req.body.hash = hash
                req.body.frames = []
                await req.db.userCol.insertOne(req.body)
                res.redirect(307, '/ToDo/login')
            }) 
        } catch (error) {
            console.log(error)
            res.json({message: "sign upp error", status: 500})
        }
    },
    postUser: async (req, res) => {
        let data = {}

        let user = await req.db.userCol.findOne({"_id": req.token.id})
        data.user = user;

        let frame = await req.db.frameCol.findOne({"_id": user.selected_frame})
        data.frame = frame;

        res.json(data)
    }
}