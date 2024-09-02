const express    = require("express");
const cors       = require('cors')
const serverless = require("serverless-http")
const path       = require('path');
const bodyParser = require('body-parser');

// const DatabaseHandler  = require('./dbHandler');
const Utility          = require('./utility');
const sendEmail        = require('./emailSender.js');

// const dbHandler = new DatabaseHandler(
// 	"jdm-master-15017.7tt.aws-us-east-1.cockroachlabs.cloud",
// 	"jdm",
// 	"bmKyHDrpbE6nP2qTiCc0nA",
// 	"jdmportfolio",
// 	26257
// );
// dbHandler.connect();


const app    = express()
const router = express.Router()

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

router.get("/test", (req, res) => {
	res.json("HAHA");
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	res.json({ success: true });
	// try {
	// 	const isConnected = await dbHandler.is_connected();
	// 	res.json({ success: true, otp: Utility.generateOtp() });
	// }
	// catch (error) {
	// 	console.error('Failed to connect to the database:', error);
	// 	res.status(500).json({ success: false, message: 'Database connection failed' });
	// }
});


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const otp = Utility.generateOtp();
    
    const subject = 'Instamine Email Verification';
    const text = `Your Instamine email verification code: ${otp}`;
    const html = `<i>Your Instamine email verification code:</i> ${otp}`;
    
    try {
        await new Promise((resolve, reject) => {
            sendEmail(email, subject, text, html, (error, message) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return reject(error);
                }
                console.log(message);
                resolve();
            });
        });
        res.json({ success: true, otp });

    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email'});
    }
});


router.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build'), 'index.html');
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

