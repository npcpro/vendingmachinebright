const root = require('path').dirname(require.main.filename);
const config = require(`${root}/config`)
const TRANSACTION = require(`${root}/models/transaction`)
const MACHINE = require(`${root}/models/machine`)
const ITEM = require(`${root}/models/item`)
const socket = require(`${root}/socket`)
const axios = require('axios')
const FormData = require('form-data');
exports.getTransaction = async (req, res) => {
	try {
		console.log('start getTransaction');
		const query = req.query
		let match = {}
		if (query.search) match = { ...match, ...searchInfoOption(query.search) }
		const sortDesc = (Number(query.sortDesc) == 0) ? 1 : -1;
		const sortBy = query.sortBy || 'createdAt'
		const sort = { [sortBy]: sortDesc }
		const min = Number(query.min) || 0
		const max = Number(query.max) || 10
		const rows = await TRANSACTION.countDocuments(match)
		const rs = await TRANSACTION.aggregate([
			{ $match: match },
			{ $sort: sort },
			{ $skip: min },
			{ $limit: max - min },
			{
				$lookup: {
					from: 'items',
					localField: 'itemId',
					foreignField: '_id',
					as: 'item',
				},
			},
			{
				$lookup: {
					from: 'status',
					localField: 'status',
					foreignField: 'status',
					as: 'status',
				},
			},
			{
				$project: {
					transactionNumber: 1,
					machineName: 1,
					itemName: 1,
					itemPrice: 1,
					img: { $arrayElemAt: ['$item.img', 0] },
					status: { $arrayElemAt: ['$status.name', 0] },
					createdAt: 1,
				}
			}
		])
		res.send({ data: rs, rows: rows })
	} catch (e) {
		console.log(e, 'catch on transaction');
		res.sendStatus(503)
	}
}

exports.getTransactionDetail = async (req, res) => {
	try {
		console.log('start getTransaction');
		const transactionNumber = req.params.transactionNumber
		const rs = await TRANSACTION.aggregate([
			{ $match: { transactionNumber: transactionNumber } },
			{
				$lookup: {
					from: 'items',
					localField: 'itemId',
					foreignField: '_id',
					as: 'item',
				},
			},
			{
				$lookup: {
					from: 'status',
					localField: 'status',
					foreignField: 'status',
					as: 'status',
				},
			},
			{
				$project: {
					transactionNumber: 1,
					machineName: 1,
					itemName: 1,
					itemPrice: 1,
					machine: 1,
					img: { $arrayElemAt: ['$item.img', 0] },
					status: { $arrayElemAt: ['$status.name', 0] },
					createdAt: 1,
				}
			}
		])
		res.send(rs[0])
	} catch (e) {
		console.log(e, 'catch on transaction');
		res.sendStatus(503)
	}
}

exports.createTransaction = async (req, res) => {
	try {
		const machineId = req.params.machineId
		const itemId = req.params.itemId
		const machine = await MACHINE.chkMachineItem(machineId, itemId)
		if (!machine) {
			res.send({ status: false, msg: 'Not Found Machine Item Ready.' })
			return;
		}
		const item = await ITEM.findOne({ _id: itemId }, { name: 1, price: 1 })
		const rs = await TRANSACTION.createTransaction(machine, item)
		res.send(rs)
		await TRANSACTION.setExpireTransaction()
	} catch (e) {
		console.log(e, 'createTransaction');
		res.sendStatus(503)
	}
}

exports.execTransaction = async (req, res) => {
	try {

		const transactionNumber = req.params.transactionNumber
		const token = req.query.token

		if (!token) {
			res.send({ status: false, msg: 'Not thing' })
			return
		}

		const chkTransaction = await TRANSACTION.countDocuments({ transactionNumber: transactionNumber, status: 1 })
		if (!chkTransaction) {
			res.send({ status: false, msg: 'Not Found This Transaction' })
			return
		}

		const chkToken = await TRANSACTION.execTransaction(token)
		if (!chkToken.status) {
			res.send(chkToken)
			return
		}

		const data = chkToken.data
		const machineItem = await MACHINE.getMachineItemClientSelect(data.machineId, data.itemId)
		console.log(machineItem, 'machineItem');
		const rs_dec = await await MACHINE.decMachineItem(machineItem.machineId, machineItem.slotId)
		if (!rs_dec.status) {
			res.send(rs_dec)
			return
		}
		const rs_transactoin = await TRANSACTION.updateTransactionStatus(transactionNumber, 2, 'Update Transaction Status On Excec.')
		if (rs_transactoin.status) {
			const socketUrl = `reloadPage:${data.machineId}`
			socket.io().emit(socketUrl, rs_transactoin);
			if (machineItem.slot.item.qty <= 10) {
				console.log('send notify');
				sendNotify(machineItem)
			}
		}
		res.send(rs_transactoin)
	} catch (e) {
		console.log(e, 'catch on execTransaction');
		res.sendStatus(503)
	}
}


exports.cancelTransaction = async (req, res) => {
	try {
		const transactionNumber = req.params.transactionNumber
		const token = req.query.token

		if (!token) {
			res.send({ status: false, msg: 'Not thing' })
			return
		}

		const chkTransaction = await TRANSACTION.countDocuments({ transactionNumber: transactionNumber, status: 1 })
		if (!chkTransaction) {
			res.send({ status: false, msg: 'Not Found This Transaction' })
			return
		}

		const chkToken = await TRANSACTION.execTransaction(token)
		if (!chkToken.status) {
			res.send(chkToken)
			return
		}
		const rs = await TRANSACTION.cancelTransaction(transactionNumber)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on cancelTransaction');
		res.sendStatus(503)
	}
}

function searchInfoOption(search) {
	return {
		$or:
			[
				{ 'transactionNumber': { $regex: search, $options: "im" } },
				{ 'machineName': { $regex: search, $options: "im" } },
				{ 'itemName': { $regex: search, $options: "im" } },
			]
	}
}

async function sendNotify(machineItem) {
	try {
		const message_ar = [
			`Machine Name : ${machineItem.name}`,
			`${machineItem.itemName} เหลือ ${machineItem.slot.item.qty - 1} ชิ้น`,
			`ชั้นที่ ${machineItem.slot.slotY}`,
			`แถวที่ ${machineItem.slot.slotX}`,
			`${machineItem.address.address}`,
			`${machineItem.address.subdistrict}`,
			`${machineItem.address.district}`,
			`${machineItem.address.city}`,
			`${machineItem.address.postcode}`,
			`ของไกล้จะหมดแล้ว`
		]
		const message = '\n' + message_ar.join('\n')
		const url = 'https://notify-api.line.me/api/notify'
		const token = config.LINE_NOTIFY_TOKEN
		const data = new FormData();
		data.append('message', message);
		await axios.post(url, data, {
			headers: {
				'Authorization': `Bearer ${token}`,
				...data.getHeaders()
			}
		})

	} catch (e) {
		console.log(e.message, 'catch on sendNotify');
	}
}