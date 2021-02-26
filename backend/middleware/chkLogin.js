const root = require('path').dirname(require.main.filename);
const ADMIN = require(`${root}/models/admin`)

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.replace('Bearer ', '')
		const rs = ADMIN.chkLogin(token)
		if (rs.status) next()
		else res.sendStatus(403)
	} catch (e) {
		console.log(e, 'catch on chklogin');
		res.sendStatus(503)
	}
}
