import Vue from 'vue'
import VueRouter from 'vue-router'
import lnc from '../auth/index'
Vue.use(VueRouter)

const beforeEnter = async (to, _, next) => {
	const rs_chkLogin = await lnc.chkLogin()
	const loginUrl = (to.path === '/login')
	console.log(loginUrl, 'loginUrl', rs_chkLogin);

	if (rs_chkLogin.status && loginUrl) {
		next('/machine')
		console.log('pass');
	} else if (rs_chkLogin.status || (!rs_chkLogin.status && loginUrl)) {
		next()
		console.log('pass 2');
	} else {
		console.log('go to login');
		next('/login')
	}
}

const routes = [
	{
		path: '/',
		name: 'Machine',
		component: () => import('../views/Machine.vue'),
		beforeEnter
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue'),
		beforeEnter
	},
	{
		path: '/item',
		name: 'Item',
		component: () => import('../views/Item.vue'),
		beforeEnter
	},
	{
		path: '/machine',
		name: 'Machine',
		component: () => import('../views/Machine.vue'),
		beforeEnter
	},
	{
		path: '/machine/model',
		name: 'Machine Model',
		component: () => import('../views/MachineModel.vue'),
		beforeEnter
	},
	{
		path: '/machineitem/:machineId',
		name: 'Machine Item',
		component: () => import('../views/MachineItem.vue'),
		beforeEnter
	},
	{
		path: '/machineitem/:machineId/client',
		name: 'Machine Item Client',
		component: () => import('../views/client/MachineItemClient.vue'),
	},
	{
		path: '/transaction',
		name: 'Transaction',
		component: () => import('../views/Transaction.vue'),
		beforeEnter
	},
	{
		path: '/nearlyoutofstock',
		name: 'Nearly Out Of Stock',
		component: () => import('../views/NearlyOutOfStock.vue'),
		beforeEnter
	},
	{
		path: '/transaction/success',
		name: 'Transaction Success',
		component: () => import('../views/client/TransactionSuccess.vue'),
		beforeEnter
	},
	{
		path: '/transaction/fail',
		name: 'Transaction Fail',
		component: () => import('../views/client/TransactionFail.vue'),
		beforeEnter
	},
	{
		path: '*',
		name: 'Not found',
		component: () => import('../views/404'),
		beforeEnter

	},
]
const router = new VueRouter({ routes: routes, mode: 'history' })


export default router
