const root = require('path').dirname(require.main.filename);
const ITEM = require(`${root}/models/item`);
const socket = require(`${root}/socket`)

exports.getItem = async (req, res) => {
	try {
		const query = req.query
		let match = { isDefault: { $ne: true } }
		if (query.search) match = { ...match, ...searchInfoOption(query.search) }
		const sortDesc = (Number(query.sortDesc) == 0) ? 1 : -1;
		const sortBy = query.sortBy || 'createdAt'
		const sort = { [sortBy]: sortDesc }
		const min = Number(query.min) || 0
		const max = Number(query.max) || 10
		const rows = await ITEM.countDocuments(match)
		const rs = await ITEM.aggregate([
			{ $match: match },
			{ $sort: sort },
			{ $skip: min },
			{ $limit: max - min },
			{
				$project: {
					name: 1,
					price: 1,
					img: 1,
					createdAt: 1,
					createdBy: 1,
				}
			}
		])
		res.send({ data: rs, rows: rows })
	} catch (e) {
		console.log(e, 'catch on getItem');
		res.sendStatus(503)
	}
}

exports.getItemList = async (_, res) => {
	try {
		const rs = await ITEM.find({}, { _id: 1, name: 1, price: 1, img: 1 })
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on getItemList');
		res.sendStatus(503)
	}
}

exports.addItem = async (req, res) => {
	try {
		let data = JSON.parse(req.body.data)
		let file = req.file
		data.img = file.filename
		const rs = await ITEM.addItem(data)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on addItem');
		res.sendStatus(503)
	}
}

exports.updateItem = async (req, res) => {
	try {
		let data = JSON.parse(req.body.data)
		let file = req.file
		if (file) {
			data.img = file.filename
		}
		const rs = await ITEM.updateItem(data)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on addItem');
		res.sendStatus(503)
	}
}

exports.deleteItem = async (req, res) => {
	try {
		const itemId = req.params.itemId
		const rs = await ITEM.deleteItem(itemId)
		res.send(rs)
	} catch (e) {
		console.log(e, 'catch on deleteItem');
		res.sendStatus(503)
	}
}

function searchInfoOption(search) {
	return {
		$or:
			[
				{ 'name': { $regex: search, $options: "im" } },
			]
	}
}