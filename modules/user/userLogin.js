//geting token when loggin in
module.exports = async (req, res, next) => {
    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')
    const ObjectID = require('mongodb').ObjectID

    //på något sätt måste jag hämta lösen i från databas
    let user = await req.db.userCol.findOne({"email": req.body.email})

    if(user) {
        const password = req.body.password
        const hash = user.hash
        
        bcrypt.compare(password, hash, (err, success) => {

            if(success) {
                const token = jwt.sign({name: user.email, id: ObjectID(user._id), latestFrame: user.frame}, process.env.SECRET, {expiresIn: 60*60*24}) // cookin försviner efter en dag
                req.token = token
                next()
            }
            else {
                req.token = {message: "Sign in faild", status: 400}
                next()
            }

        })
    }
    else {
        req.token = {message: "Sign in faild", status: 400}
        next()
    }


}