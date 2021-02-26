"use strict";
// const root = require('path').dirname(require.main.filename);
// const config = require(`${root}/config`)
// const url = config.MONGO_URL
// const con = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator')
const timestamps = require('mongoose-timestamp')
const mangoSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	machineModel: { type: String, required: true, default: 'A1' },
	// machineModelName: { type: String, required: true, default: 'A1' },
	// machineModelId: { type: String, required: true, default: 'A1' },
	address: {
		address: { type: String, required: true },
		district: { type: String, required: true },
		subdistrict: { type: String, required: true },
		city: { type: String, required: true },
		postcode: { type: String, required: true },
		la: { type: String, },
	},
	slot: [{
		// slotId: { type: mongoose.Schema.Types.ObjectId, rquired: true },
		slotY: { type: Number, required: true },
		slotX: { type: Number, required: true },
		item: { type: Object }
		// item: {
		// 	itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
		// 	qty: { type: Number, required: true },
		// }
	}],
	active: { type: Boolean, default: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId },
})

mangoSchema.indexes();

mangoSchema.statics = {
	addMachine: async function (data, machineModel) {
		try {
			data = {
				name: data.name,
				machineModel: machineModel.name,
				address: {
					address: data.address.address,
					subdistrict: data.address.subdistrict,
					district: data.address.district,
					city: data.address.city,
					postcode: data.address.postcode,
					la: data.address.la || '',
				},
			}
			const chkName = await this.countDocuments({ name: data.name })
			if (chkName) return { status: false, msg: 'This Name Is Exists.' }

			const chkMachineFormAdd = this.chkMachineFormAdd(data)
			if (!chkMachineFormAdd) return { status: false, msg: 'Invalid Form' }

			data.slot = this.createSlot(machineModel.slot)
			const rs = await this.create(data)
			if (rs) return { status: true, msg: 'Add Matchine Success', data: rs }
			return { status: false, msg: 'Add Matchine Fail' }
		} catch (e) {
			console.log(e, 'catch on addMatchine');
			return { status: false, msg: 'Add Matchine Catch' }
		}
	},
	createSlot: function (modelSlot) {
		modelSlot.sort((a, b) => a.row > b.row ? 1 : -1);
		let createSlot = [];
		for (const slotKey in modelSlot) {
			for (let i = 1; i <= modelSlot[slotKey].column; i++) {
				const slot = {
					slotId: new mongoose.Types.ObjectId(),
					slotX: Number(i),
					slotY: Number(slotKey) + 1,
					item: {},
				}
				createSlot.push(slot)
			}
		}
		return createSlot;
	},
	updateMachineInfo: async function (data) {
		try {
			const _id = new mongoose.Types.ObjectId(data._id)
			data = {
				name: data.name,
				address: {
					address: data.address.address,
					subdistrict: data.address.subdistrict,
					district: data.address.district,
					city: data.address.city,
					postcode: data.address.postcode,
					la: data.address.la || '',
				},
			}

			const chkName = await this.countDocuments({ name: data.name, _id: { $ne: _id } })
			if (chkName) return { status: false, msg: 'This Name Is Exists.' }

			const chkMachineFormUpdate = this.chkMachineFormUpdate(data)
			if (!chkMachineFormUpdate) return { status: false, msg: 'Invalid Form' }

			const rs = await this.updateOne({ _id: _id }, { $set: data })
			if (rs.n) return { status: true, msg: 'Update Machine Success' }
			else return { status: false, msg: 'Update Machine Fail' }
		} catch (e) {
			console.log(e, 'catch on Update Machine');
			return { status: false, msg: 'Update Machine Catch' }
		}

	},
	deleteMachine: async function (_id) {
		try {
			_id = new mongoose.Types.ObjectId(_id)
			const machine = await this.findOne({ _id: _id }, { name: 1 })
			if (!machine) return { status: false, msg: 'Not Found Machine' }
			const rs = await this.deleteOne({ _id: _id })

			if (rs.n) return { status: true, msg: 'Delete Machine Success', data: machine }
			else return { status: false, msg: 'Delete Machine Fail' }

		} catch (e) {
			console.log(e, 'catch on Delete Machine');
			return { status: false, msg: 'Delete Machine Catch' }
		}
	},
	getMachineItem: async function (machineId) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			let rs = await this.aggregate([
				{ $match: { _id: machineId } },
				{ $limit: 1 },
				{
					$project: {
						name: 1,
						machineModel: 1,
						address: 1,
						slot: 1,
					}
				},
				{ $unwind: "$slot" },
				// { $match: { 'slot.item.itemId': { $exists: true } } }, // chk only
				{
					$lookup: {
						from: 'items',
						localField: 'slot.item.itemId',
						foreignField: '_id',
						as: 'item',
					},
				},
				{
					$addFields: {
						'slot.item': {
							itemId: '$slot.item.itemId',
							qty: '$slot.item.qty',
							updatedAt: '$slot.item.updatedAt',
							name: { $arrayElemAt: ['$item.name', 0] },
							price: { $arrayElemAt: ['$item.price', 0] },
							img: { $arrayElemAt: ['$item.img', 0] },
						},
						machineId: '$_id'
					}
				},
				{ $group: { "_id": "$slot.slotY", slot: { $push: "$slot" }, machineId: { $first: '$machineId' }, name: { $first: '$name' }, address: { $first: '$address' }, machineModel: { $first: '$machineModel' } } },
				{ $sort: { 'slot.slotY': 1 } },
				{ $group: { _id: "$name", slot: { $push: "$slot" }, machineId: { $first: '$machineId' }, name: { $first: '$name' }, address: { $first: '$address' }, machineModel: { $first: '$machineModel' } } },
			])
			rs = rs[0]
			return rs
		} catch (e) {
			console.log(e, 'catch on getOneMachine');
			return false
		}
	},
	manageMachineItem: async function (machineId, data) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			const slotId = new mongoose.Types.ObjectId(data._id)
			const itemdId = new mongoose.Types.ObjectId(data.itemId)
			const qty = data.qty
			const item = {
				itemId: itemdId,
				qty: Number(qty),
				updatedAt: new Date()
			}
			const rs = await this.updateOne({ _id: machineId },
				{ $set: { 'slot.$[elm].item': item } },
				{ arrayFilters: [{ "elm._id": slotId }] })
			if (rs.n) {
				return { status: true, msg: 'Manage Machine Item Success.' }
			}
			else return { status: false, msg: 'Manage Machine Item Fail.' }
		} catch (e) {
			console.log(e, 'catch on ');
			return { status: true, msg: 'Manage Machine Item Catch.' }
		}
	},
	deleteMachineItem: async function (machineId, slotId) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			slotId = new mongoose.Types.ObjectId(slotId)
			const rs = await this.updateOne({ _id: machineId },
				{ $set: { 'slot.$[elm].item': {} } },
				{ arrayFilters: [{ "elm._id": slotId }] })
			if (rs.n) return { status: true, msg: 'Delete Machine Item Success.' }
			else return { status: false, msg: 'Delete Machine Item Fail.' }
		} catch (e) {
			console.log(e, 'catch on ');
			return { status: true, msg: 'Delete Machine Item Catch.' }
		}
	},
	getMachineItemClient: async function (machineId) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			let rs = await this.aggregate([
				{ $match: { _id: machineId } },
				{ $limit: 1 },
				{
					$project: {
						name: 1,
						slot: 1,
					}
				},
				{ $unwind: "$slot" },
				{ $match: { 'slot.item.itemId': { $exists: true } } }, // chk only
				{
					$lookup: {
						from: 'items',
						localField: 'slot.item.itemId',
						foreignField: '_id',
						as: 'item',
					},
				},
				{
					$addFields: {
						'slot.item': {
							itemId: '$slot.item.itemId',
							qty: '$slot.item.qty',
							updatedAt: '$slot.item.updatedAt',
							name: { $arrayElemAt: ['$item.name', 0] },
							price: { $arrayElemAt: ['$item.price', 0] },
							img: { $arrayElemAt: ['$item.img', 0] },
						},
						machineId: '$_id'
					}
				},
				{ $match: { 'slot.item.name': { $exists: true } } },
				{
					$project: {
						name: 1,
						machineId: 1,
						slotItem: '$slot.item'
					}
				},
				{ $group: { "_id": "$slotItem.itemId", item: { $push: "$slotItem" }, name: { $first: '$name' }, machineId: { $first: '$machineId' } } },
				{
					$project: {
						name: 1,
						machineId: 1,
						itemId: '$_id',
						itemName: { $arrayElemAt: ['$item.name', 0] },
						itemQty: { $arrayElemAt: ['$item.qty', 0] },
						itemImg: { $arrayElemAt: ['$item.img', 0] },
						itemPrice: { $arrayElemAt: ['$item.price', 0] }
					}
				},
				{ $sort: { itemName: 1 } }
			])
			return rs
		} catch (e) {
			console.log(e, 'catch on getOneMachine');
			return false
		}
	},
	getMachineItemClientSelect: async function (machineId, itemId) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			itemId = new mongoose.Types.ObjectId(itemId)
			let rs = await this.aggregate([
				{ $match: { _id: machineId } },
				{ $limit: 1 },
				{
					$project: {
						machineId: '$_id',
						address: 1,
						name: 1,
						slot: 1,
						updatedAt: 1,
					}
				},
				{ $unwind: "$slot" },
				{ $match: { 'slot.item.itemId': itemId } },
				{
					$lookup: {
						from: 'items',
						localField: 'slot.item.itemId',
						foreignField: '_id',
						as: 'item',
					},
				},
				{
					$project: {
						name: 1,
						machineId: 1,
						address: 1,
						slotId: '$slot.slotId',
						itemId: '$slot.item.itemId',
						slot: '$slot',
						itemName: { $arrayElemAt: ['$item.name', 0] },
						itemImg: { $arrayElemAt: ['$item.img', 0] },
						itemPrice: { $arrayElemAt: ['$item.price', 0] },
						updatedAt: '$slot.item.updatedAt',
					}
				},
				{ $sort: { updatedAt: 1, itemQty: 1 } }
			])
			return rs[0]
		} catch (e) {
			console.log(e, 'catch on getOneMachine');
			return false
		}
	},
	chkMachineItem: async function (machineId, itemId) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			itemId = new mongoose.Types.ObjectId(itemId)
			const machine = await this.findOne({ _id: machineId, 'slot.item.itemId': itemId, 'slot.item.qty': { $gt: 0 } }, { name: 1, machineModel: 1, slot: 1, address: 1 })
			const slot = machine.slot.filter(i => i.item && String(i.item.itemId) == String(itemId) && i.item.qty > 0).pop()
			if (slot && slot.item && slot.item.qty > 0) {
				delete machine.slot
				return machine
			} else {
				return false;
			}
		} catch (e) {
			console.log(e, 'catch on chkMachineItem');
			return false
		}
	},
	decMachineItem: async function (machineId, slotId) {
		try {
			machineId = new mongoose.Types.ObjectId(machineId)
			slotId = new mongoose.Types.ObjectId(slotId)
			const rs = await this.updateOne({ _id: machineId },
				{ $inc: { 'slot.$[elm].item.qty': -1 } },
				{ arrayFilters: [{ 'elm.slotId': slotId }] })
			if (rs.n) return { status: true, msg: 'Dec MachineItem Success.' }
			else return { status: false, msg: 'Dec MachineItem Fail.' }
		} catch (e) {
			console.log(e, 'catch on decMachineItem');
			return { status: false, msg: 'Dec MachineItem Catch.' }
		}
	},

	chkMachineFormAdd: function (data) {
		return (data.name.length >= 3 &&
			data.machineModel &&
			data.address.address.length >= 3 &&
			data.address.subdistrict.length >= 3 &&
			data.address.district.length >= 3 &&
			data.address.city.length >= 3 &&
			data.address.postcode.length == 5
		);
	},
	chkMachineFormUpdate: function (data) {
		return (data.name.length >= 3 &&
			data.address.address.length >= 3 &&
			data.address.subdistrict.length >= 3 &&
			data.address.district.length >= 3 &&
			data.address.city.length >= 3 &&
			data.address.postcode.length == 5
		);
	},

}

mangoSchema.plugin(uniqueValidator)
mangoSchema.plugin(timestamps)
module.exports = mongoose.model('machine', mangoSchema)
