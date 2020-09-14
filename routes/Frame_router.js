const express = require('express')
const router = express.Router()
const frameController = require('../controllers/Frame_controllers.js')
const _auth = require('../modules/user/userAuth.js')

router.post('/frame/get', _auth, 
    frameController.postGetFrame(req, res))

router.post('/frame/update', _auth, 
    frameController.postUpdateFrame(req, res))

router.post('/frame/delete', _auth, 
    frameController.postDeleteFrame(req, res))

router.post('/frame/create', _auth, 
    frameController.postCreateFrame(req, res))

router.post('/frame/update/position', _auth, 
    frameController.postUpdateFramePosition(req, res))

module.exports = router