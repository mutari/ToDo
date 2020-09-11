const express = require("express")
const router = express.Router()
const userControllers = require('../controllers/User_controllers.js')
const _login = require('../modules/user/userLogin.js')
const _auth = require('../modules/user/userAuth.js')

router.post("/signUp", (req, res) => {
    userControllers.postSignUp(req, res)
})

router.post("/login", _login, (req, res) => {
    userControllers.postLogin(req, res);
})

router.post("/user", _auth, (req, res) => {
    userControllers.postGetUser(req, res);
})

router.post("/change/user", _auth, (req, res) => {
    userControllers.postUpdateUser(req, res);
})

module.exports = router