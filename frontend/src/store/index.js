import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const requireContext = require.context('./modules', true, /.*\.js$/)
const modules = requireContext.keys()
	.map(file => {
			return [file.replace(/(^.\/)|(\.js$)/g, ''),requireContext(file)];
		})
	.reduce((modules, [name, module]) => {
		if (module.namespaced === undefined) module.namespaced = true
		return {
			...modules,
			[name]: module
		}
	}, {})
export default new Vuex.Store({
	modules,
	strict: true
})

