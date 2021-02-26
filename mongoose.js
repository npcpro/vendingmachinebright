const root = require('path').dirname(require.main.filename);
const mongoose = require('mongoose')
const config = require(`${root}/config`)
const url = config.MONGO_URL
console.log(url, '< == url');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to Mongoose DB ", url)
	})
	.catch((e) => {
		console.log(e);
		console.log("Connection failed Mongoose DB ", url)
	})
module.exports = mongoose;