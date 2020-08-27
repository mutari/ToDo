const express = require("express")
const router = express.Router()

router.get("/User", (req, res) => {
    console.log("teas")
    res.send("user data")
})

module.exports = router