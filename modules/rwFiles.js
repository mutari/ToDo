module.exports = {
    readFile: (path) => {
        const fs = require('fs')
        fs.readFile(__dirname + path, 'utf8', (err, jsonString) => {
            console.log(__dirname + path)
            if(err) throw `File read failed: ${err}`
            return jsonString
        })
    }
}