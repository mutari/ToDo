var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAILUSERNAME + '@gmail.com',
        pass: process.env.EMAILPASSWORD
    }
})

module.exports = {
    send: (options, _callback) => {
        transporter.sendMail(options, _callback);
    },
    getEmail: process.env.EMAILUSERNAME + '@gmail.com'
}