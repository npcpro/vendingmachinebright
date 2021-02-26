const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY

module.exports = async (token) => {
	try {
		return true
	} catch (e) {
		console.log(e, 'catch on chklogin_socket');
		return false;
	}
}
