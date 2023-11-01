import { Storage } from '@/utils/storage'
import dayjs from 'dayjs'
import Vue from 'vue'
import { userModel } from '@/api'

const user = {
    state: {
        token: undefined,
        refreshToken: undefined,
        avatarUrl: undefined,
        nickName: undefined,
        platNo: undefined,
        openId: undefined,
        unionId: undefined,
        isLogin: false,
        hasFreshToken: false,
        cid: undefined,
        phoneNo: undefined
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
            Storage.set('pa_token', token)
        },
        REMOVE_TOKEN: (state) => {
            state.token = undefined
            Storage.remove('pa_token')
        },
        SET_REFRESH_TOKEN: (state, refreshToken) => {
            state.refreshToken = refreshToken
            state.hasFreshToken = true
            Storage.set('pa_refresh_token', refreshToken)
        },
        REMOVE_REFRESH_TOKEN: (state) => {
            state.refreshToken = undefined
            Storage.remove('pa_refresh_token')
        },
        SET_PLAT_NO: (state, platNo) => {
            state.platNo = platNo
            Storage.set('pa_plat_no', platNo)
        },
        REMOVE_PLAT_NO: state => {
            state.platNo = undefined
            Storage.remove('pa_plat_no')
        },
        SET_OPEN_ID: (state, openId) => {
            state.openId = openId
            Storage.set('pa_open_id', openId)
        },
        REMOVE_OPEN_ID: state => {
            state.openId = undefined
            Storage.remove('pa_open_id')
        },
        SET_UNION_ID: (state, unionId) => {
            state.unionId = unionId
            Storage.set('pa_union_id', unionId)
        },
        REMOVE_UNION_ID: state => {
            state.unionId = undefined
            Storage.remove('pa_union_id')
        },
        SET_CID: (state, cid) => {
            state.cid = cid
            Storage.set('pa_cid', cid)
        },
        REMOVE_CID: state => {
            state.cid = undefined
            Storage.remove('pa_cid')
        },
        SET_PHONE_NO: (state, phoneNo) => {
            state.phoneNo = phoneNo
            Storage.set('pa_phone_no', phoneNo)
        },
        REMOVE_PHONE_NO: state => {
            state.phoneNo = undefined
            Storage.remove('pa_phone_no')
        },
        SET_USER_INFO: (state, info) => {
            const { avatarUrl, nickName, platNo } = info
            state.avatarUrl = avatarUrl
            state.nickName = nickName
            state.platNo = platNo
            Storage.set('pa_user_info', info)
        },
        REMOVE_USER_INFO: (state) => {
            state.avatarUrl = undefined
            state.nickName = undefined
            state.platNo = undefined
            Storage.remove('pa_user_info')
        },
        SET_IS_LOGIN: (state, flag) => {
            state.isLogin = flag
        },
        SET_HAS_REFRESH_TOKEN: (state, flag = true) => {
            state.hasFreshToken = flag
        }
    },
    actions: {
        login({ commit, dispatch }, payload) {
            return new Promise(resolve => {
                let token = ''
                let refreshToken = ''
                let info = ''
                let platNo = ''
                let openId = ''
                let unionId = ''
                let cid = ''
                let phoneNo = ''
                if (payload) {
                    payload.token ? token = payload.token : token = Storage.get('pa_token')
                    payload.refreshToken ? refreshToken = payload.refreshToken : refreshToken = Storage.get('pa_refresh_token')
                    payload.userInfo ? info = payload.userInfo : info = Storage.get('pa_user_info')
                    payload.platNo ? platNo = payload.platNo : platNo = Storage.get('pa_plat_no')
                    payload.openId ? openId = payload.openId : openId = Storage.get('pa_open_id')
                    payload.unionId ? unionId = payload.unionId : unionId = Storage.get('pa_union_id')
                    payload.cid ? cid = payload.cid : cid = Storage.get('pa_cid')
                    payload.phoneNo ? phoneNo = payload.phoneNo : () => {
                        commit('REMOVE_PHONE_NO')
                    }
                    Storage.set('pa_token_expired', dayjs().add(30, 'm').valueOf())
                } else {
                    token = Storage.get('pa_token')
                    info = Storage.get('pa_user_info')
                    platNo = Storage.get('pa_plat_no')
                    openId = Storage.get('pa_open_id')
                    unionId = Storage.get('pa_union_id')
                    refreshToken = Storage.get('pa_refresh_token')
                    cid = Storage.get('pa_cid')
                    phoneNo = Storage.get('pa_phone_no')
                }
                if (token) {
                    commit('SET_TOKEN', token)
                }
                if (refreshToken) {
                    commit('SET_REFRESH_TOKEN', refreshToken)
                }
                if (info) {
                    commit('SET_USER_INFO', info)
                }
                if (platNo) {
                    commit('SET_PLAT_NO', platNo)
                }
                if (openId) {
                    commit('SET_OPEN_ID', openId)
                }
                if (unionId) {
                    // Vue.prototype.$sensors.login(unionId)
                    commit('SET_UNION_ID', unionId)
                }
                if (cid) {
                    commit('SET_CID', cid)
                }
                if (phoneNo) {
                    commit('SET_PHONE_NO', phoneNo)
                }
                resolve()
            })
        },
        setUserInfo({ commit }, userInfo) {
            return new Promise(resolve => {
                let info = ''
                if (userInfo) {
                    info = userInfo
                    Storage.set('pa_token_expired', dayjs().add(30, 'm').valueOf())
                } else {
                    info = Storage.get('pa_user_info')
                }
                if (info) {
                    commit('SET_USER_INFO', info)
                }
                resolve()
            })
        },
        logout({ commit }) {
            return new Promise(resolve => {
                commit('REMOVE_TOKEN')
                commit('REMOVE_REFRESH_TOKEN')
                commit('REMOVE_USER_INFO')
                commit('REMOVE_PLAT_NO')
                commit('REMOVE_OPEN_ID')
                commit('REMOVE_UNION_ID')
                commit('SET_CART', [])
                commit('REMOVE_ADDRESS')
                commit('REMOVE_CID')
                commit('REMOVE_PHONE_NO')
                resolve()
            })
        },
        clearUserInfo({ commit }) {
            commit('REMOVE_USER_INFO')
        },
        setAvatar({ state }, avatarUrl) {
            const params = {
                avatarUrl
            }
            return new Promise((resolve, reject) => {
                userModel.setProfile(params).then(res => {
                    if (res.status === 0) {
                        state.avatarUrl = avatarUrl
                        Vue.prototype.$message.success({ title: '修改成功', duration: 500 })
                        resolve()
                    } else {
                        Vue.prototype.$toast({ title: res.message })
                        reject()
                    }
                })
            })
        },
        setNickname({ state }, nickName) {
            const params = {
                nickName
            }
            return new Promise((resolve, reject) => {
                userModel.setProfile(params).then(res => {
                    if (res.status === 0) {
                        state.nickName = nickName
                        Vue.prototype.$message.success({ title: '修改成功', duration: 500 })
                        resolve()
                    } else {
                        Vue.prototype.$toast({ title: res.message })
                        reject()
                    }
                })
            })
        },
        setGender({ state }, gender) {
            const params = {
                gender
            }
            return new Promise((resolve, reject) => {
                userModel.setProfile(params).then(res => {
                    if (res.status === 0) {
                        state.gender = gender
                        Vue.prototype.$message.success({ title: '修改成功', duration: 500 })
                        resolve()
                    } else {
                        Vue.prototype.$toast({ title: res.message })
                        reject()
                    }
                })
            })
        },
        setPhoneNo({ state, commit }, phoneNo) {
            const params = {
                phoneNo
            }
            return new Promise((resolve, reject) => {
                userModel.setProfile(params).then(res => {
                    if (res.status === 0) {
                        commit('SET_PHONE_NO', phoneNo)
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        }
    }
}
export default user
