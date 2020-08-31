module.exports = (req, res, next) => {

    const jwt = require('jsonwebtoken')

    if(req.body.token) {
        try {
            
            let token = jwt.verify(req.body.token, process.env.SECRET)

            delete token.iat;
            delete token.exp;
            
            req.token = token 

            if(token) next();
            else res.json({message: "User is not loged in", status: 420})

        }
        catch(err) {
            res.json({message: "User is not loged in", status: 420})
        }
    }
    else res.json({message: "User is not loged in", status: 420})


}