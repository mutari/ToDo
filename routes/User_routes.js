const express = require("express")
const router = express.Router()
const userControllers = require('../controllers/User_controllers.js')

router.post("/signUp", (req, res) => {
    userControllers.postSignUp(req, res)
})

router.get("/login", (req, res) => {
    userControllers.postLogin(req, res);
})

module.exports = router