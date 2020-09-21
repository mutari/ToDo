const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    console.log(req.body)

    if(req.body.token && req.cookie.tokenSecure) {
        try {
            let token = jwt.verify(req.body.token, process.env.SECRET)
            let tokenSecure = jwt.verify(req.cookie.tokenSecure, process.env.SECRET2)

            delete token.iat; delete token.exp;
            delete tokenSecure.iat; delete tokenSecure.exp;
            
            req.token = token 
            req.tokenSecure = tokenSecure

            if(token && tokenSecure) next();
            else res.json({message: "User is not loged in", status: 420})
        }
        catch(err) {
            res.json({message: "User is not loged in", status: 420})
        }
    }
    else res.json({message: "User is not loged in", status: 420})

}