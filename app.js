const express = require("express");
const app = express();

port = process.env.port | 80

app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

app.post("/login", (req, res) => {
    console.log(req.body)
})

app.listen(port, err => {
    if(err) throw err
    console.log(`Server started and runing on port: ${port}`)
})
