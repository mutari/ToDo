const express = require('express')
const router = express.Router()
const frameController = require('../controllers/Frame_controllers.js')
const _auth = require('../modules/user/userAuth.js')

router.post('/frame/get', _auth, (req, res) => {
    frameController.postGetFrame(req, res)
})

router.post('/frame/update', _auth, (req, res) => {
    frameController.postUpdateFrame(req, res)
})

router.post('/frame/delete', _auth, (req, res) => {
    frameController.postDeleteFrame(req, res)
})

router.post('/frame/create', (req, res) => {
    frameController.postCreateFrame(req, res)
})

module.exports = router