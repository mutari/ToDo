const rw = require('../modules/rwFiles.js')

module.exports = {
    postLogin: (req, res) => {
        data = rw.readFile('/../MySql_DataBase/testdata/test1.json', data => {
            console.log("test", data)
            res.json(data)
        })
    },
    postSignUp: (req, res) => {
        console.log(req.body)
        res.json(req.body)
    }
}