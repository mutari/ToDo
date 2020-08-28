module.exports = {
    postLogin: (req, res) => {
        console.log("test")
        res.send("test")
    },
    postSignUp: (req, res) => {
        console.log(req.body)
        res.json(req.body)
    }
}