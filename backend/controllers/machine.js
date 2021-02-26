const root = require('path').dirname(require.main.filename);
const MACHINE = require(`${root}/models/machine`);
const MACHINE_MODEL = require(`${root}/models/machine_model`);
const socket = require(`${root}/socket`)

exports.getMachine = async (req, res) => {
	try {
		const query = req.query
		let match = {}
		if (query.search) match = { ...match, ...searchInfoOption(query.search) }
		const sortDesc = (Number(query.sortDesc) == 0) ? 1 : -1;
		const sortBy = query.sortBy || 'createdAt'
		const sort = { [sortBy]: sortDesc }
		const min = Number(query.min) || 0
		const max = Number(query.max) || 10
		const rows = await MACHINE.countDocuments(match)
		let rs = await MACHINE.aggregate([
			{ $match: match },
			{ $sort: sort },
			{ $skip: min },
			{ $limit: max - min },
			{
				$project: {
					name: 1,
					address: 1,
					createdAt: 1,
					machineModel: 1,
					avilable: '$slot'
				}
			}
		])
		for (const k in rs) {
			rs[k].avilable = rs[k].avilable.filter(i => i.item && i.item.qty).map(i => i.item.qty).reduce((a, b) => { return a + b }, 0);
		}
		res.send({ data: rs, rows: rows })

	} catch (e) {
		console.log(e, 'getMachine');
		res.sendStatus(503)
	}
}

exports.getMachine = async (req, res) => {
	try {
		const query = req.query
		let match = {}
		if (query.search) match = { ...match, ...searchInfoOption(query.search) }
		const sortDesc = (Number(query.sortDesc) == 0) ? 1 : -1;
		const sortBy = query.sortBy || 'createdAt'
		const sort = { [sortBy]: sortDesc }
		const min = Number(query.min) || 0
		const max = Number(query.max) || 10
		const rows = await MACHINE.countDocuments(match)
		let rs = await MACHINE.aggregate([
			{ $match: match },
			{ $sort: sort },
			{ $skip: min },
			{ $limit: max - min },
			{
				$project: {
					name: 1,
					address: 1,
					createdAt: 1,
					machineModel: 1,
					avilable: '$slot'
				}
			}
		])
		for (const k in rs) {
			rs[k].avilable = rs[k].avilable.filter(i => i.item && i.item.qty).map(i => i.item.qty).reduce((a, b) => { return a + b }, 0);
		}
		res.send({ data: rs, rows: rows })

	} catch (e) {
		console.log(e, 'getMachine');
		res.sendStatus(503)
	}
}

exports.addMachine = async (req, res) => {
	try {
		const data = req.body
		const machineModel = await MACHINE_MODEL.findOne({ name: data.machineModel })
		const rs = await MACHINE.addMachine(data, machineModel)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on addMachine');
		res.sendStatus(503)
	}
}

exports.updateMachineInfo = async (req, res) => {
	try {
		const data = req.body
		const rs = await MACHINE.updateMachineInfo(data)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on updateMachineInfo');
		res.sendStatus(503)
	}
}

exports.deleteMachine = async (req, res) => {
	try {
		const machineId = req.params.machineId
		const rs = await MACHINE.deleteMachine(machineId)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on deleteMachine');
		res.sendStatus(503)
	}
}

exports.getMachineItem = async (req, res) => {
	try {
		const machineId = req.params.machineId
		const rs = await MACHINE.getMachineItem(machineId)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on getOneMachine');
		res.sendStatus(503)
	}
}

exports.manageMachineItem = async (req, res) => {
	try {
		const data = req.body
		const machineId = req.params.machineId
		const rs = await MACHINE.manageMachineItem(machineId, data)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on addMachine');
		res.sendStatus(503)
	}
}

exports.deleteMachineItem = async (req, res) => {
	try {
		const machineId = req.params.machineId
		const slotId = req.params.slotId
		const rs = await MACHINE.deleteMachineItem(machineId, slotId)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on deleteMachineItem');
		res.sendStatus(503)
	}
}

exports.getMachineItemClient = async (req, res) => {
	try {
		const machineId = req.params.machineId
		let rs = await MACHINE.getMachineItemClient(machineId)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on getMachineItemClient');
		res.sendStatus(503)
	}
}

exports.getMachineItemNearlyOutOfStock = async (req, res) => {
	try {
		const query = req.query
		let match = {}
		if (query.search) match = { ...match, ...searchInfoOption(query.search) }
		const sortDesc = (Number(query.sortDesc) == 0) ? 1 : -1;
		const sortBy = query.sortBy || 'createdAt'
		const sort = { [sortBy]: sortDesc }
		const min = Number(query.min) || 0
		const max = Number(query.max) || 10
		const rows = await MACHINE.countDocuments(match)
		let rs = await MACHINE.aggregate([
			// { $match: match },
			// { $match: { $or: [{ 'slot.item.itemId': { $exists: false } }, { 'slot.item.qty': { $lt: 10 } }] } },
			// { $sort: sort },
			// { $skip: min },
			// { $limit: max - min },
			// {
			// 	$project: {
			// 		name: 1,
			// 		address: 1,
			// 		createdAt: 1,
			// 		machineModel: 1,
			// 		avilable: '$slot'
			// 	}
			// }
			{ $match: match },
			{ $unwind: '$slot' },
			{
				$match: {
					$or: [
						{ 'slot.item.itemId': { $exists: false } },
						{ 'slot.item.qty': { $lt: 9 } },
					]
				}
			},
			{ $group: { _id: '$_id', avilable: { $push: '$slot' }, name: { $first: '$name' }, machineModel: { $first: '$machineModel' }, address: { $first: '$address' }, createdAt: { $first: '$createdAt' } } },
			{ $sort: sort },
			{ $skip: min },
			{ $limit: max - min },
			{
				$project: {
					name: 1,
					address: 1,
					createdAt: 1,
					machineModel: 1,
					avilable: '$slot'
				}
			}
		])
		res.send({ data: rs, rows: rows })

	} catch (e) {
		console.log(e, 'getMachine');
		res.sendStatus(503)
	}
}

function searchInfoOption(search) {
	return {
		$or:
			[
				{ 'name': { $regex: search, $options: "im" } },
				{ 'address.address': { $regex: search, $options: "im" } },
				{ 'address.district': { $regex: search, $options: "im" } },
				{ 'address.subdistrict': { $regex: search, $options: "im" } },
				{ 'address.city': { $regex: search, $options: "im" } },
				{ 'address.postcode': { $regex: search, $options: "im" } },
				{ 'address.la': { $regex: search, $options: "im" } },
			]
	}
}