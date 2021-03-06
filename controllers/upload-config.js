const multer = require('multer')
const path = require('path')

module.exports = {
	storage: new multer.diskStorage({
		destination: path.resolve(__dirname, ".", "../public/uploads"),
		filename: function (_, file, callback) {
			callback(null, `${new Date * 1}_${file.originalname}`)
		}
	})
}
