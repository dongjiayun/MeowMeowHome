import Vue from 'vue'
import App from './App.vue'

import Global from './utils/global.js'
import Filter from './plugins/filters.js'
import AsyncComputed from 'vue-async-computed'
import router from '@/router/router'
import config from '@/config'
import dict from '@/config/dict'
import store from '@/store'

// import share from '@/mixin/share'
//
// Vue.mixin(share)

Vue.prototype.$Router = router
Vue.prototype.$Config = config
Vue.prototype.$Dict = dict

Vue.filter('orGet', <T, V>(value: T | undefined, defaults: V): NonNullable<T> | V => value ?? defaults)

Vue.use(Global)
Vue.use(Filter)
Vue.use(AsyncComputed)

Vue.config.productionTip = false

new App({
    store
}).$mount()
