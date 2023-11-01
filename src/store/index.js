import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import business from './modules/business'

import getters from '@/store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app, user, business
    },
    getters
})
