const express = require("express")
const bodyParser = require('body-parser')
const app = express()
let userRoutes = require('./routes/User_routes.js')

port = process.env.port | 80

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/public"))
app.use('/ToDo', userRoutes)


app.post("/login", (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.listen(port, err => {
    if(err) throw err
    console.log(`Server started and runing on port: ${port}`)
})
