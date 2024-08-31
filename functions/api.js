const express    = require("express");
const cors       = require('cors')
const serverless = require("serverless-http")
const dotenv     = require('dotenv');
const path       = require('path');
const basicAuth  = require('express-basic-auth');
const dbHandler  = require('./dbHandler');

dbHandler.connect()
.then(() => {
	console.log('Database connection established.');
})
.catch(error => {
	console.error('Failed to connect to the database:', error);
	process.exit(1);
});

const app    = express()
const router = express.Router()

app.use(basicAuth({
	users: { 'admin': process.env.DB_AUTH_PASS },
	challenge: true
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

router.get("/test", (req, res) => {
	res.json("HAHHA")
});

router.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build'), 'index.html');
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

