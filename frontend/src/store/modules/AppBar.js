
module.exports = {
	state: {
		drawer: true,
	},
	mutations: {
		drawer(state, val) {
			state.drawer = !val
		},
	},
	actions: {
		drawer: ({ commit }, val) => {
			commit('drawer', val)
		}
	},
	getters: {
		drawer: state => state.drawer,
	}
}
