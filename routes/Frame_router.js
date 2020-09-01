const express = require('express')
const router = express.Router()
const frameController = require('../controllers/Frame_controllers.js')
const _auth = require('../modules/user/userAuth.js')

router.get('/get/frames', _auth, (req, res) => {
    frameController.postFrame(req, res)
})

module.exports = router