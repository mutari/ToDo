const express = require("express");
const app = express();

port = process.env.port | 80

app.use(express.static(__dirname + "/public"))

app.listen(port, err => {
    if(err) throw err
    console.log(`Server started and runing on port: ${port}`)
})
