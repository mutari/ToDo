const express = require("express")
const router = express.Router()
const userControllers = require('../controllers/User_controllers.js')
const _login = require('../modules/user/userLogin.js')
const _auth = require('../modules/user/userAuth.js')

router.post("/signUp",
    userControllers.postSignUp)

router.post(
    "/login", 
        _login, 
            userControllers.postLogin)

router.post(
    "/user", 
        _auth, 
            userControllers.postGetUser)

router.post(
    "/change/user", 
        _auth, 
            userControllers.postUpdateUser)

router.post(
    "/comfirm/send",
        //_auth,
            userControllers.postSendComfirmMail)

router.post(
    "/comfirm/:id",
        userControllers.postComfirmMail)

module.exports = router