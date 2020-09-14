const express = require('express')
const router = express.Router()
const frameController = require('../controllers/Frame_controllers.js')
const _auth = require('../modules/user/userAuth.js')

router.post(
    '/frame/get', 
        _auth, 
            frameController.postGetFrame)

router.post(
    '/frame/update', 
        _auth, 
            frameController.postUpdateFrame)  

router.post(
    '/frame/delete', 
        _auth, 
            frameController.postDeleteFrame)

router.post(
    '/frame/create', 
        _auth, 
            frameController.postCreateFrame)

router.post(
    '/frame/update/position', 
        _auth, 
            frameController.postUpdateFramePosition)

module.exports = router