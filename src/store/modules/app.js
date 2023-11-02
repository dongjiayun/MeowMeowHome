import { obsModel } from '@/api/obs'
import Vue from 'vue'

const app = {
    state: {
        showMask: false,
        showLoading: false,
        timer: undefined,
        currentMusicTab: '',
        currentCity: undefined,
        obsInfo: undefined,
        statusBarHeight: 0,
        routerLocked: true,
        isLogining: false,
        pageBeforeLogin: undefined,
        // 解决uni-popup不渲染在根节点问题
        popupMask: false,
        disablePageScroll: false,
        clickId: undefined,
        scene: undefined,
    },
    mutations: {
        SHOW_POPUP_MASK(state) {
            state.popupMask = true
        },
        HIDE_POPUP_MASK(state) {
            state.popupMask = false
        },
        SHOW_MASK(state) {
            state.showMask = true
        },
        SHOW_LOADING(state) {
            state.showLoading = true
        },
        HIDE_MASK(state) {
            state.hideMask = false
        },
        HIDE_MASK_AND_LOADING(state) {
            state.showMask = false
            state.showLoading = false
        },
        SET_CURRENT_MUSIC_TAB(state, tab) {
            state.currentMusicTab = tab
        },
        SET_CURRENT_CITY(state, city) {
            state.currentCity = city
        },
        SET_OBS_INFO: (state, info) => {
            state.obsInfo = info
        },
        SET_BAR_HEIGHT: (state, height) => {
            state.statusBarHeight = height
        },
        SET_ROUTE_LOCKED: (state, isLocked) => {
            state.routerLocked = isLocked
        },
        ENABLE_PAGE_SCROLL: state => {
            state.disablePageScroll = false
        },
        DISABLE_PAGE_SCROLL: state => {
            state.disablePageScroll = true
        },
        SET_CLICK_ID: (state, clickId) => {
            state.clickId = clickId
        },
        REMOVE_CLICK_ID: state => {
            state.clickId = undefined
        }
    },
    actions: {
        showLoading({ commit, state }) {
            commit('SHOW_MASK')
            state.timer = setTimeout(() => {
                commit('SHOW_LOADING')
            }, 0)
        },
        hideLoading({ commit, state }) {
            commit('HIDE_MASK_AND_LOADING')
            clearTimeout(state.timer)
        },
        async setObsInfo({ commit }) {
            const { data } = await obsModel.getSignature()
            const result = { token: data }
            commit('SET_OBS_INFO', result)
        },
        setStatusBarHeight({ commit }, height) {
            commit('SET_BAR_HEIGHT', height)
        },
        setPageBeforeLogin({ state }, route) {
            if (route) {
                route.query = {
                    ...route.query,
                    isFromRetryLastPage: true
                }
                state.pageBeforeLogin = route
            } else {
                const name = Vue.prototype.$Router.getCurrentRouteName()
                const query = Vue.prototype.$Router.getCurrentRouteQuery()
                const route = {
                    name, query: { ...query, isFromRetryLastPage: true }
                }
                state.pageBeforeLogin = route
            }
        },
        retryLastPage({ state }) {
            if (state.pageBeforeLogin) {
                Vue.prototype.$Router.redirectTo(state.pageBeforeLogin)
                state.pageBeforeLogin = undefined
            } else {
                Vue.prototype.$Router.redirectTo({ name: 'home' })
            }
        }
    }
}
export default app
