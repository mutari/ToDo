const express = require('express')
const router = express.Router()
const frameController = require('../controllers/Frame_controllers.js')
const _auth = require('../modules/user/userAuth.js')

router.post('/get/frame', _auth, (req, res) => {
    frameController.postGetFrame(req, res)
})

router.post('/update/frame', (req, res) => {
    frameController.postUpdateFrame(req, res)
})

router.post('/delete/frame', (req, res) => {
    frameController.postDeleteFrame(req, res)
})

router.post('/create/frame', (req, res) => {
    frameController.postCreateFrame(req, res)
})

module.exports = router