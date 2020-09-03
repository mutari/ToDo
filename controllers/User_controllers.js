const rw = require('../modules/rwFiles.js')
const bcrypt = require('bcryptjs')
const ObjectID = require('mongodb').ObjectID

module.exports = {
    postLogin: async (req, res) => {// självklart kommer lösenord kontrol och så vidare
        let data = {} // i data objektet ska både user data samt frame data coh hash data 
        
        //get user data
        let user = await req.db.userCol.findOne({email: req.body.email})
        if (user) data.user = user
        else {res.json({message: "Could not find a user white that email in the database", status: 400}); return}

        //get frame data
        let frame = await req.db.frameCol.findOne({"_id": user.selected_frame})
        if (frame) data.frame = frame
        else rw.readFile('/../dataSchema/frame_start.json', async out => { 
            data.frame = out
            data.frame.author = user._id
            data.frame.timestampCreated = "$$NOW"
            data.frame.timestampUpdated = "$$NOW"
            data.user.selected_frame = (await req.db.frameCol.insertOne(data.frame))["ops"][0]["_id"]
            data.user.frames = [data.user.selected_frame]
            await req.db.userCol.updateOne({email: req.body.email}, {$set: {selected_frame: data.user.selected_frame}}, (err, res) => {
                if (err) throw err;
                console.log("1 document updated");
              })
        }) //generates a new frame

        data.token = req.token
        console.log(data)

        res.json(data)
    },
    postSignUp: async (req, res) => {
        
        bcrypt.hash(req.body.password, 12, async (err, hash) => {
            delete req.body.password
            req.body.hash = hash
            await req.db.userCol.insertOne(req.body)
        })

        res.json({message: "Acount created", status: 200}) // 200 = all okej, 400 = did not find data, 500 = server fucked up 
    }
}