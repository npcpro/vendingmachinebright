
require('dotenv').config();
const cors = require('cors');
const http = require('http');
// const https = require('https');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use("/api/admin", require('./routers/admin'))
app.use("/api/machine", require('./routers/machine'))
app.use("/api/item", require('./routers/item'))
app.use("/api/transaction", require('./routers/transaction'))
app.use('/public', express.static('public'))


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
console.log(process.env.SERVER_PORT, '(process.env.SERVER_PORT');
const appsever = server.listen(process.env.SERVER_PORT, async function () {
	require('./socket').start(appsever);
	const root = require('path').dirname(require.main.filename);
})
