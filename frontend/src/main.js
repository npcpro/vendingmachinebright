import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$http.defaults.baseURL = 'http://localhost:8080'

let token = localStorage.getItem('token');
if (token && token.length) {
	token = JSON.parse(localStorage.getItem('token')).token
	Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

new Vue({
	store,
	router,
	vuetify,
	render: h => h(App)
}).$mount('#app')
