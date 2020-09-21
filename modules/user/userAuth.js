const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    if(req.body.token && req.cookies.tokenSecure) {
        try {
            let token = jwt.verify(req.body.token, process.env.SECRET)
            let tokenSecure = jwt.verify(req.cookies.tokenSecure, process.env.SECRET2)

            delete token.iat; delete token.exp;
            delete tokenSecure.iat; delete tokenSecure.exp;
            
            req.token = token 
            req.tokenSecure = tokenSecure

            if(token && tokenSecure) {
                next();
                console.log("test")
            }
            else res.json({message: "User is not loged in", status: 420})
        }
        catch(err) {
            res.json({message: "User is not loged in", status: 420})
        }
    }
    else res.json({message: "User is not loged in", status: 420})

}