const nodemailer = require('nodemailer');

// You can use this for your website, Makes authentication possible.
// You just need to think how you use this. This is same for the sms authentication

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'test@gmail.com',
        pass: '' // Generated password from Google.
    }
});

let mailOptions = {
    from: 'test@gmail.com',
    to: 'test2@gmail.com',
    subject: 'Hello',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error)
    {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
