import { toast, Toast } from '@/utils/index'
import { Storage } from '@/utils/storage'
import { authModel, userModel } from '@/api'
import store from '@/store'
import router from '@/router/router'
import Vue from 'vue'

export const checkLogin = () => {
    return new Promise(async resolve => { // eslint-disable-line
        const token = store.state.user.token || Storage.get('pa_token')
        if (token) {
            resolve()
        } else {
            await handleLogin(true)
        }
    })
}

export const handleLogin = isFromCheckLogin => {
    const islogin = store.state.user.isLogin
    if (islogin) {
        return
    }
    const token = store.state.user.token || Storage.get('pa_token')
    const refreshToken = store.state.user.refreshToken || Storage.get('pa_refresh_token')
    return new Promise((resolve, reject) => {
        store.commit('SET_IS_LOGIN', true)
        if (token) {
            if (refreshToken) {
                authModel.refresh().then(res => {
                    if (res.status === 0) {
                        store.commit('SET_TOKEN', res.data)
                        store.commit('SET_HAS_REFRESH_TOKEN')
                        resolve()
                    } else {
                        toast({ title: res.message })
                        store.dispatch('logout')
                        setTimeout(() => {
                            goToLogin(isFromCheckLogin)
                        }, 1000)
                        reject()
                    }
                }).catch(() => {
                    store.dispatch('logout')
                    goToLogin(isFromCheckLogin)
                    reject()
                }).finally(() => {
                    store.commit('SET_IS_LOGIN', false)
                })
            } else {
                store.commit('SET_IS_LOGIN', false)
                store.dispatch('logout')
                goToLogin(isFromCheckLogin)
                reject()
            }
        } else {
            store.commit('SET_IS_LOGIN', false)
            goToLogin(isFromCheckLogin)
            resolve()
        }
    })
}

export const goToLogin = isFromCheckLogin => {
    const name = Vue.prototype.$Router.getCurrentRouteName()
    const query = Vue.prototype.$Router.getCurrentRouteQuery()
    const route = {
        name, query
    }
    if (name !== 'login') { store.dispatch('setPageBeforeLogin', route) }
    Vue.prototype.$Router[isFromCheckLogin ? 'push' : 'redirectTo']({ name: 'login', query: { isFromCheckLogin }})
}

export const goToSetMobile = () => {
    const name = Vue.prototype.$Router.getCurrentRouteName()
    const query = Vue.prototype.$Router.getCurrentRouteQuery()
    const route = {
        name, query
    }
    if (name !== 'login') { store.dispatch('setPageBeforeLogin', route) }
    Vue.prototype.$Router.push({ name: 'login', query: {
        step: 2,
        isFromCheckLogin: false
    }})
}

let isCheckingPhone = false
let isHasPhone = false

export const checkMobile = () => {
    if (isCheckingPhone) {
        return
    }
    if (isHasPhone) {
        return Promise.resolve(true)
    }
    isCheckingPhone = true
    return new Promise((resolve, reject) => {
        Toast.loading()
        userModel.profile().then(res => {
            if (res.status === 0) {
                const { data } = res
                const { phoneNo } = data
                if (phoneNo) {
                    isHasPhone = true
                    resolve(true)
                } else {
                    goToSetMobile()
                    reject()
                }
            } else {
                reject()
                toast({ title: res.message })
            }
        }).finally(() => {
            isCheckingPhone = false
            Toast.hide()
        }).catch(() => {
            reject()
        })
    })
}

export const login = (type, params) => {
    const islogin = store.state.user.isLogin
    if (islogin) {
        return
    }
    return new Promise((resolve, reject) => {
        store.commit('SET_IS_LOGIN', true)
        switch (type) {
            case 'wechat':
                uni.login({
                    success({ code }) {
                        Toast.loading()
                        authModel.login({ code }).then(async r => {
                            if (r.status === 0) {
                                const { cid, jwtToken, platNo, openId, unionId, refreshToken, phoneNo } = r.data
                                await store.dispatch('login', {
                                    token: jwtToken,
                                    platNo,
                                    openId,
                                    unionId,
                                    refreshToken,
                                    cid,
                                    phoneNo
                                })
                                toast({ title: '登录成功' })
                                resolve(!!phoneNo)
                            } else {
                                toast({ title: r.message })
                                reject(r.message)
                            }
                        }).catch(e => {
                            toast({ title: '登录失败,请稍后重试' })
                            reject(e)
                        }).finally(() => {
                            store.commit('SET_IS_LOGIN', false)
                            Toast.hide()
                        })
                    },
                    fail(e) {
                        toast({ title: '登录失败,请稍后重试' })
                        store.commit('SET_IS_LOGIN', false)
                        reject(e)
                    }
                })
                break
            default :
                Toast.loading()
                authModel.login(params).then(async res => {
                    if (res.status === 0) {
                        const { cid, token, refreshToken, phone } = res.data
                        await store.dispatch('login', {
                            token,
                            refreshToken,
                            cid,
                            phone
                        })
                        toast({ title: '登录成功' })
                        resolve(!!phone)
                    } else {
                        toast({ title: res.message })
                        reject(res.message)
                    }
                }).finally(() => {
                    Toast.hide()
                    store.commit('SET_IS_LOGIN', false)
                }).catch(e => {
                    toast({ title: '登录失败,请稍后重试' })
                    reject(e)
                })
        }
    })
}

export const getToken = (showLoading = false) => {
    let interval
    let retryTime = 0
    return new Promise((resolve, reject) => {
        const islogin = store.state.user.isLogin
        if (islogin) {
            interval = setInterval(() => {
                const islogin = store.state.user.isLogin
                if (!islogin) {
                    clearInterval(interval)
                    resolve()
                } else {
                    if (retryTime > 20) {
                        reject()
                    }
                    retryTime++
                }
            }, 200)
            return
        }
        if (showLoading)Toast.loading()
        store.commit('SET_IS_LOGIN', true)
        uni.login({
            success({ code }) {
                authModel.login({ code }).then(async r => {
                    if (r.status === 0) {
                        const { jwtToken, platNo, openId, unionId } = r.data
                        await store.dispatch('login', {
                            token: jwtToken,
                            platNo,
                            openId,
                            unionId
                        })
                        uni.$emit('refreshedToken')
                        resolve()
                    } else {
                        toast({ title: r.message })
                        reject(r.message)
                    }
                }).catch(e => {
                    reject(e)
                }).finally(() => {
                    if (showLoading)Toast.hide()
                    store.commit('SET_IS_LOGIN', false)
                })
            },
            async fail(e) {
                store.commit('SET_IS_LOGIN', false)
                await store.dispatch('login', {
                    token: -1,
                })
                if (showLoading)Toast.hide()
                router.redirectTo({ name: 'index' })
                reject(e)
            }
        })
    })
}

export const getTokenInterval = (interval = 1000 * 60 * 10) => {
    setInterval(getToken, interval)
}

// 微信基础库2.10.4版本对用户信息相关接口进行了调整，使用 uni.getUserInfo 获取得到的 userInfo 为匿名数据，建议使用 uni.getUserProfile 获取用户信息。
// uni.getUserProfile 只有点击才能触发 故此方法作废
export const getUserInfo = () => {
    uni.getUserInfo({
        success({ userInfo }) {
            store.dispatch('setUserInfo', userInfo)
        },
        fail(e) {
            store.dispatch('logout')
        }
    })
}

export const getSetting = () => {
    uni.getSetting({
        success({ authSetting }) {
            console.log(authSetting)
            if (!authSetting['scope.userInfo']) {
                store.dispatch('clearUserInfo')
            }
        }
    })
}

export const logout = () => {
    return authModel.logout().then(res => {
        if (res.status === 0) {
            store.dispatch('logout')
        } else {
            toast({ title: res.message })
        }
    })
}
