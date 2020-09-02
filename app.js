require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient;

(async () => {
    try {
        const con = await mongo.connect(process.env.CONSTRING, {useNewUrlParser: true, useUnifiedTopology: true});
        const port = process.env.PORT || 3000

        const db = await con.db('ToDo')

        const userCol = await db.collection('User_profile')
        const frameCol = await db.collection('Frame_profile')
        const app = express()
        
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
        app.use(express.static(__dirname + "/public"))
        app.use((req, res, next) => {
            req.db = {userCol: userCol, frameCol: frameCol} 
            next();
        })

        app.use('/ToDo',  require('./routes/User_routes.js'))
        
        app.listen(port, err => {
            if(err) throw err
            console.log(`Server started and runing on port: ${port}`)
        });
    } catch(error) {
        console.log(error)
    } 
})();
