import Vue from 'vue'
import App from './App.vue'

import Global from './utils/global.js'
import Filter from './plugins/filters.js'
import AsyncComputed from 'vue-async-computed'
import router from '@/router/router'
import config from '@/config'
import dict from '@/config/dict'
import store from '@/store'
import {useSdk} from "@/utils";

// #ifdef H5
useSdk('https://web-9gikcbug35bad3a8-1304825656.tcloudbaseapp.com/sdk/1.3.0/mplogin2.min.js')
useSdk('https://web-9gikcbug35bad3a8-1304825656.tcloudbaseapp.com/sdk/1.3.0/cloud.js')
// #endif


Vue.prototype.$Router = router
Vue.prototype.$Config = config
Vue.prototype.$Dict = dict

Vue.filter('orGet', <T, V>(value: T | undefined, defaults: V): NonNullable<T> | V => value ?? defaults)

Vue.use(Global)
Vue.use(Filter)
Vue.use(AsyncComputed)

import VConsole from 'vconsole'
if (process.env.VUE_APP_CURRENTMODE !== 'prod') {
    const vConsole = new VConsole()
    // @ts-ignore
    Vue.use(vConsole)
}

Vue.config.productionTip = false

new App({
    store
}).$mount()
