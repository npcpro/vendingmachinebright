"use strict";
const root = require('path').dirname(require.main.filename);
const config = require(`${root}/config`)
const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator')
const timestamps = require('mongoose-timestamp')
const url = config.MONGO_URL
const con = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
const mangoSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	slot: { type: Array, required: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId },
})

mangoSchema.indexes();

mangoSchema.statics = {
	createMachineModel: async function () {
		try {
			const chkExistsDefulat = await this.countDocuments()
			if (!chkExistsDefulat) {
				const data = {
					name: "A1",
					slot: [
						{ row: 1, column: 12 },
						{ row: 2, column: 12 },
						{ row: 3, column: 6 },
					],
				}
				await this.create(data)
			} else {
				console.log('Not createMachineModel');
			}
		} catch (e) {
			console.log(e, 'catch on createMachineModel');
		}
	},
	getOneMachineModel: async function (name = 'A1') {
		try {
			const rs = await this.find({ name: name })
			return rs;
		} catch (e) {
			console.log(e, 'catch on getOneMachineModel');
		}
	},

}

mangoSchema.plugin(uniqueValidator)
mangoSchema.plugin(timestamps)
module.exports = con.model('machine_model', mangoSchema)
