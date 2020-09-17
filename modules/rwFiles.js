module.exports = {
    readFile: async (path, _callback) => {
        const fs = require('fs')
        let data = await fs.readFileSync(__dirname + path, 'utf8')
        return _callback(JSON.parse(data))
    }
}