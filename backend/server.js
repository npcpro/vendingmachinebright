
require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
// const cors = require('cors');
// const morgan = require('morgan');
// app.use(cors());
// app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use("/api/admin", require('./routers/admin'))
app.use("/api/machine", require('./routers/machine'))
app.use("/api/item", require('./routers/item'))
app.use("/api/transaction", require('./routers/transaction'))
app.use('/public', express.static('public'))

if (Number(process.env.PRODUCTION)) {
	console.log('call_server');
	app.use(express.static(__dirname + "/dist"))
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + "/dist/index.html"))
	})
} else {
	app.use(express.static(__dirname + "/../frontend/dist"))
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname + "/../frontend/dist/index.html"))
	})
}


app.get('*', async function (_, res) {
	res.sendStatus(404)
})
app.post('*', async function (_, res) {
	res.sendStatus(404)
})
app.put('*', async function (_, res) {
	res.sendStatus(404)
})
app.patch('*', async function (_, res) {
	res.sendStatus(404)
})
app.delete('*', async function (_, res) {
	res.sendStatus(404)
})

const server = http.createServer(app)
console.log(process.env.PORT, '(process.env.PORT');
const appsever = server.listen(process.env.PORT, async function () {
	require('./socket').start(appsever);
})
