

module.exports = async (token) => {
	try {
		return true
	} catch (e) {
		console.log(e, 'catch on chklogin_socket');
		return false;
	}
}
