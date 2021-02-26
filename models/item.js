"use strict";
require('dotenv').config();
const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator')
const timestamps = require('mongoose-timestamp')
const url = process.env.MONGO_URL
const con = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
const mangoSchema = mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	img: { type: String, required: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId },
})

mangoSchema.index(
	{ name: 1, lotNumber: 1 },
	{ unique: true }
);

mangoSchema.statics = {
	addItem: async function (data) {
		try {
			data = {
				name: data.name,
				price: data.price,
				img: data.img,
			}
			const chkName = await this.countDocuments({ name: data.name })
			if (chkName) return { status: false, msg: 'This Name Is Exists.' }

			const chkItemForm = this.chkItemForm(data)
			if (!chkItemForm) return { status: false, msg: 'Invalid Form' }

			const rs = await this.create(data)
			if (rs) return { status: true, msg: 'Add Matchine Success', data: rs }
			return { status: false, msg: 'Add Matchine Fail' }
		} catch (e) {
			console.log(e, 'catch on addMatchine');
			return { status: false, msg: 'Add Matchine Catch' }
		}
	},
	updateItem: async function (data) {
		try {
			const _id = new mongoose.Types.ObjectId(data._id)
			data = {
				name: data.name,
				price: data.price,
				img: data.img,
			}

			const chkName = await this.countDocuments({ name: data.name, _id: { $ne: _id } })
			if (chkName) return { status: false, msg: 'This Name Is Exists.' }

			const chkItemForm = this.chkItemForm(data)
			if (!chkItemForm) return { status: false, msg: 'Invalid Form' }

			const rs = await this.updateOne({ _id: _id }, { $set: data })
			if (rs.n) return { status: true, msg: 'Update Item Success' }
			else return { status: false, msg: 'Update Item Fail' }
		} catch (e) {
			console.log(e, 'catch on Update Item');
			return { status: false, msg: 'Update Item Catch' }
		}

	},
	deleteItem: async function (_id) {
		try {
			_id = new mongoose.Types.ObjectId(_id)
			const Item = await this.findOne({ _id: _id }, { name: 1 })
			if (!Item) return { status: false, msg: 'Not Found Item' }
			const rs = await this.deleteOne({ _id: _id })

			if (rs.n) return { status: true, msg: 'Delete Item Success', data: Item }
			else return { status: false, msg: 'Delete Item Fail' }

		} catch (e) {
			console.log(e, 'catch on Delete Item');
			return { status: false, msg: 'Delete Item Catch' }
		}
	},
	chkItemForm: function (data) {
		return (data.name.length >= 3 && data.price >= 10 && data.img);
	},

}

mangoSchema.plugin(uniqueValidator)
mangoSchema.plugin(timestamps)
module.exports = con.model('item', mangoSchema)
