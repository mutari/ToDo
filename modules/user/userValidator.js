const { body, validationResult } = require('express-validator')

module.exports = {

    createAcc: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .not().isEmpty(),
        body('name')
            .trim()
            .escape()
            .not().isEmpty(),
        body('password')
    ],

    login: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .not().isEmpty(),
        body('password')
    ]

}