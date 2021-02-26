"use strict";
// const root = require('path').dirname(require.main.filename);
// const config = require(`${root}/config`)
// const url = config.MONGO_URL
// const con = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator')
const timestamps = require('mongoose-timestamp')


const mangoSchema = mongoose.Schema({
	status: { type: Number, required: true, unique: true },
	name: { type: String, required: true, unique: true },
})
// status 
// 1 = peding
// 2 = success
// 3 = cancel
// 4 = expire
mangoSchema.indexes();

mangoSchema.statics = {
	createStatus: async function () {
		try {
			const chkStatus = await this.countDocuments()
			if (!chkStatus) {
				const data = [
					{ name: 'pending', status: 1, color: 'waring' },
					{ name: 'success', status: 2, color: 'success' },
					{ name: 'cancel', status: 3, color: 'error' },
					{ name: 'expire', status: 4, color: 'grey' },
				]
				for (let item of data) {
					await this.create(item)
				}
			} else {
				console.log('Not thing');
			}

		} catch (e) {
			console.log(e, 'catch on createStatus');
		}
	},
}

mangoSchema.plugin(uniqueValidator)
mangoSchema.plugin(timestamps)
module.exports = mongoose.model('status', mangoSchema)
