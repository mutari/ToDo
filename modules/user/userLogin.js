//geting token when loggin in
module.exports = async (req, res, next) => {
    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')
    const ObjectID = require('mongodb').ObjectID

    console.log(req.body)

    //på något sätt måste jag hämta lösen i från databas
    let user = await req.db.userCol.findOne({"email": req.body.email})

    if(user) {
        const password = req.body.password
        const hash = user.hash

        console.log(password, hash)
        
        bcrypt.compare(password, hash, (err, success) => {

            if(success) {
                const token = jwt.sign({email: user.email, name: user.name, id: ObjectID(user._id)}, process.env.SECRET) // cookin försviner efter en dag
                //const tokenSecure = jwt.sign({id: ObjectID(user._id)}, process.env.SECRET2)
                req.token = token
                //req.tokenSecure = tokenSecure
                next()
            }
            else {
                console.log('password faild:  ', err)
                req.token = {message: "Sign in faild", status: 400}
                next()
            }

        })
    }
    else {
        console.log('user do not exists: ', user)
        req.token = {message: "Sign in faild", status: 400}
        next()
    }


}