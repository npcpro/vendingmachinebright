
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
app.get('/test', (_, res) => {
	res.send('Runnnn')
})
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use("/api/admin", require('./routers/admin'))
app.use("/api/machine", require('./routers/machine'))
app.use("/api/item", require('./routers/item'))
app.use("/api/transaction", require('./routers/transaction'))
app.use('/public', express.static('public'))

app.use(express.static(__dirname + "/dist"))
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + "/dist/index.html"))
})

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
const appsever = server.listen(3000, async function () {
	require('./socket').start(appsever);
	require('./mongoose')
})
