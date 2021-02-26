const root = require('path').dirname(require.main.filename);
const delay = require('delay');
let createdServer = ''
let io;
module.exports = {
	start: async (httpServer) => {
		console.log('socket io start ');
		io = require('socket.io')(httpServer, {
			// cors: {
			// 	origin: "http://localhost:8080",
			// 	credentials: true
			// }
		});
		createdServer = io
		io.on('connection', async function (socket) {
			socket.on('disconnect', function () {
				console.log('user disconnected');
			});
		});
		await delay(2200)
		console.log('wait sucess');
	},
	io: () => {
		return createdServer
	}

}

