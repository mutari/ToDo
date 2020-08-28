module.exports = {
    readFile: (path, _callback) => {
        const fs = require('fs')
        fs.readFile(__dirname + path, 'utf8', (err, jsonString) => {
            if(err) throw `File read failed: ${err}`
            _callback(JSON.parse(jsonString))
        })
    }
}