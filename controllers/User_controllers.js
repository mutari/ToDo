const rw = require('../modules/rwFiles.js')

module.exports = {
    postLogin: (req, res) => {
        //console.log(rw.readFile('/../MySql_DataBase/testdata/test1.json'))
        //res.json(rw.readFile('/../MySql_DataBase/testdata/test1.json'))
        console.log(req.body)
        res.json(req.body)
    },
    postSignUp: (req, res) => {
        console.log(req.body)
        res.json(req.body)
    }
}