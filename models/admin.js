"use strict";
const root = require('path').dirname(require.main.filename);
const config = require(`${root}/config`)
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator')
const timestamps = require('mongoose-timestamp')
const jwt = require('jsonwebtoken');
const jwt_key = config.JWT_KEY
const jwt_exp = 60 * 60 * 4; // 4 hours
const url = config.MONGO_UR

const mangoSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
})

mangoSchema.indexes();

mangoSchema.statics = {
	createAdmin: async function () {
		try {
			const chkAdmin = await this.countDocuments()
			if (!chkAdmin) {
				const admins = [
					{ name: 'adminVending1', username: 'adminVending1', password: 'adminVending1', email: 'adminVending1@gmail.com' },
					{ name: 'adminVending2', username: 'adminVending2', password: 'adminVending1', email: 'adminVending2@gmail.com' },
				]
				for (let admin of admins) {
					admin.password = bcrypt.hashSync(admin.password, 10); // true
					await this.create(admin)
				}
			} else {
				console.log('Not thing');
			}

		} catch (e) {
			console.log(e, 'catch on createAdmins');
		}
	},
	login: async function (username, password) {
		try {
			const admin = await this.findOne({ $or: [{ username: username }, { 'email': username }] }, { name: 1, username: 1, password: 1 });
			if (!admin) {
				return { status: false }
			} else {
				const rs = bcrypt.compareSync(password, admin.password);
				if (rs) {
					const payload = { uid: admin._id, name: admin.name, timestamp: new Date() * 1 }
					console.log(payload, 'payload');
					const token = jwt.sign(payload, jwt_key, { expiresIn: jwt_exp });
					return { status: true, payload: payload, token: token };
				} else {
					return { status: false }
				}
			}
		} catch (e) {
			console.log(e, 'catch on chkAdmin');
			return { status: false }
		}
	},
	chkLogin: function (token) {
		try {
			const rs = jwt.verify(token, jwt_key)
			if (rs) return { ...{ status: true }, ...rs }
			else return { status: false }
		} catch (e) {
			if (e.message) console.log(e.message)
			else console.log(e)
			return { status: false }
		}
	},
}

mangoSchema.plugin(uniqueValidator)
mangoSchema.plugin(timestamps)
module.exports = mongoose.model('admin', mangoSchema)
