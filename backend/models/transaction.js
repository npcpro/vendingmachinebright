"use strict";
require('dotenv').config();
const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const QRCode = require('qrcode')
const moment = require('moment')
const numeral = require('numeral')
const uniqueValidator = require('mongoose-unique-validator')
const timestamps = require('mongoose-timestamp')
const url = process.env.MONGO_URL
const con = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY
const jwt_exp = 70; // 70 sec
const server = `http://localhost:7700/api/transaction`
const mangoSchema = mongoose.Schema({
	transactionNumber: { type: String, required: true },
	machineId: { type: mongoose.Schema.Types.ObjectId, required: true },
	machineName: { type: String, required: true },
	itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
	itemName: { type: String, required: true },
	itemPrice: { type: Number, required: true },
	updatedBy: { type: mongoose.Schema.Types.ObjectId },
	status: { type: Number, default: 1 },
	token: { type: String, required: true },
	msg: { type: String },
	machine: { type: Object, required: true }

})
// status 
// 1 = pedding
// 2 = success
// 3 = fail
// 4 = cancel
mangoSchema.index(
	{ transactionNumber: 1 },
	{ unique: true }
);



mangoSchema.statics = {
	generateTransactionNumber: async function (machineName) {
		const count = await this.countDocuments()
		return `${numeral(count + 1).format('00000000')}${machineName}`.toUpperCase()
	},
	createTransaction: async function (machine, item) {
		try {
			const transactionNumber = await this.generateTransactionNumber(machine.name)
			let data = {
				transactionNumber: transactionNumber,
				machineId: machine._id,
				machineName: machine.name,
				itemId: item._id,
				itemName: item.name,
				itemPrice: item.price,
			}
			const token = jwt.sign(data, jwt_key, { expiresIn: jwt_exp });
			data.token = token
			data.machine = machine
			const rs = await this.create(data)
			if (rs) {
				const url = `${server}/exec/${transactionNumber}?token=${token}`
				const cancelUrl = `${server}/cancel/${transactionNumber}?token=${token}`
				const qrcodeUrl = await QRCode.toDataURL(url)
				return { status: true, msg: 'Create Transaction Success', qrcodeUrl: qrcodeUrl, token: token, url: url, cancelUrl: cancelUrl }
			} else {
				return { status: false, msg: 'Create Transaction Faikl' }
			}
		} catch (e) {
			console.log(e, 'Catch On createTransaction');
			return { status: false, msg: 'Catch On createTransaction' }
		}
	},
	execTransaction: async function (token) {
		try {
			const rs = jwt.verify(token, jwt_key)
			if (rs) {
				return { status: true, data: rs, msg: 'Exec Transaction Success' }
			} else {
				return {
					status: false, msg: 'Exec Transaction Fail'
				}
			}
		} catch (e) {
			if (e.message) console.log(e.message, 'Catch On excecTransaction');
			else console.log(e, 'Catch On excecTransaction');
			return { status: false, msg: 'Exec Transaction Catch' }
		}
	},
	updateTransactionStatus: async function (transactionNumber, status, msg) {
		try {
			const rs = await this.updateOne({ transactionNumber: transactionNumber, status: 1 }, { $set: { status: status, msg: msg } })
			if (rs.n) return { status: true, msg: 'Transaction Success.' }
			else return { status: false, msg: 'Transaction Fail.' }
		} catch (e) {
			console.log(e, 'catch on updateTransaction');
			return { status: false, msg: 'Transaction Catch' }
		}
	},
	cancelTransaction: async function (transactionNumber) {
		try {
			const rs = await this.updateOne({ transactionNumber: transactionNumber, status: 1 }, { $set: { status: 4, msg: 'Cancel Order From Machine' } })
			if (rs.n) return { status: true, msg: 'Cancel Transaction Success.' }
			else return { status: false, msg: 'Cancel Transaction Fail.' }
		} catch (e) {
			console.log(e, 'catch on updateTransaction');
			return { status: false, msg: 'Cancel Transaction Catch' }
		}
	},

	setExpireTransaction: async function () {
		try {
			const filterTime = moment().subtract(jwt_exp, 'seconds').format()
			await this.updateOne({ status: 1, createdAt: { $lte: new Date(filterTime) } }, { $set: { status: 3, msg: 'Auto Set Expire.' } })
		} catch (e) {
			console.log(e, 'catch on updateTransaction');

		}
	}
}

mangoSchema.plugin(uniqueValidator)
mangoSchema.plugin(timestamps)
module.exports = con.model('transaction', mangoSchema)
