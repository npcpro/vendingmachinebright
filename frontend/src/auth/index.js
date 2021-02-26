import axios from 'axios'
export default {
	get: async (url) => {
		try {
			const rs = await axios.get(url)
			return rs;
		} catch (e) {
			console.log(e, 'catch on get', url);
			if (e.response.status == 403) {
				// cleartoken()
			}
		}
	},
	post: async (url, data) => {
		try {
			const rs = await axios.post(url, data)
			return rs;
		} catch (e) {
			console.log(e, 'catch on post');
			if (e.response.status == 403) {
				localStorage.clear();
			} else {
				return e;
			}
		}

	},
	patch: async (url, data) => {
		try {
			const rs = await axios.patch(url, data)
			return rs;
		} catch (e) {
			console.log(e, 'catch on patch');
			if (e.response.status == 403) {
				localStorage.clear();
			} else {
				return e;
			}
		}
		return data
	},
	delete: async (url) => {
		try {
			const rs = await axios.delete(url)
			return rs;
		} catch (e) {
			console.log(e, 'catch on delete');
			if (e.response.status == 403) {
				localStorage.clear();
			} else {
				return e;
			}
		}
	},
	chkEmail: (email) => {
		const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		const chkEmail = email.match(new RegExp(emailPattern, 'gim'))
		return chkEmail != null;
	},
	chkLogin: async () => {
		try {
			if (localStorage.getItem('token')) {
				const rs = await axios.post('/api/admin/chkLogin')
				if (rs.status === 200 && rs.data.status) {
					return { status: true, data: rs.data }
				} else {
					console.log('chk login fail');
					localStorage.clear();
					return { status: false }
				}
			} else {
				console.log('Not found token');
				return { status: false }
			}
		} catch (e) {
			console.log(e, 'catch : chkLogin');
			localStorage.clear();
			return { status: false }
		}
	},
	qeuryStr: (options) => {
		if (options) {
			const min = options.itemsPerPage * (options.page - 1) || 0;
			const max = options.itemsPerPage * (options.page) || 10;
			const sortBy = (options.sortBy[0]) ? options.sortBy[0] : '';
			const sortDesc = (options.sortDesc[0]) ? 1 : 0;
			const search = (options.search) ? options.search : '';
			const status = (options.status) ? options.status : 0;
			let query = `?min=${min}&max=${max}&sortBy=${sortBy}&sortDesc=${sortDesc}`
			if (search) query += `&search=${search}`
			if (status) query += `&status=${status}`
			return query
		} else {
			return ''
		}
	}
}
