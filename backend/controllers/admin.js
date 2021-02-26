const root = require('path').dirname(require.main.filename);
const ADMIN = require(`${root}/models/admin`);

exports.login = async (req, res) => {
	try {
		const data = req.body
		const rs = await ADMIN.login(data.username, data.password)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on login');
		res.sendStatus(503)
	}
}

exports.logout = async (_, res) => {
	try {
		res.sendStatus(200);
	} catch (e) {
		console.log(e, 'catch on logout');
		res.sendStatus(503);
	}
}

exports.chkLogin = async (req, res) => {
	try {
		console.log(req.headers.authorization, ' req.headers.authorization <===');
		const token = req.headers.authorization.replace('Bearer ', '')
		const rs = await ADMIN.chkLogin(token)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on logout');
		res.sendStatus(503);
	}
}
