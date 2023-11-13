import Request from './request'
import indexConfig from '@/config'
import { toast, objectTreeShake, Toast } from '@/utils'
import store from '@/store'
import { handleLogin } from '@/utils/auth'

const http = new Request()

// request全局参数设置
http.setConfig(config => {
    /* 设置全局配置 */
    config.baseUrl = indexConfig.baseUrl /* 根域名不同 */
    const systemInfo = uni.getSystemInfoSync()
    const systemInfoHeaders = {
        'device-name': systemInfo.brand, // 设备名称
        width: systemInfo.screenWidth, // 屏幕宽度
        height: systemInfo.screenHeight, // 屏幕高度
        os: systemInfo.platform, // 客户端平台
        'os-version': systemInfo.system // 操作系统版本
    }
    config.header = {
        ...config.header,
        ...systemInfoHeaders
    }
    return config
})

http.interceptor.request(
    config => {
        Toast.loading()
        if (config.method === 'GET') {
            config.params = objectTreeShake(config.params)
        } else {
            config.data = objectTreeShake(config.data)
        }
        const token = store.state.user.token
        const refreshToken = store.state.user.refreshToken
        if (token) {
            config.header['Authorization'] = token
        } else {
            config.header['Authorization'] = ''
        }
        if (refreshToken) {
            config.header['Refresh-Token'] = refreshToken
        } else {
            config.header['Refresh-Token'] = ''
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

http.interceptor.response(
    async response => {
        /* 请求之后拦截器 */
        Toast.hide()
        switch (response.statusCode) {
            case 200:
                return response.data
            case 400:
                toast({ title: '错误的请求' })
                return Promise.reject(response.data.message)
            case 401 || 403:
                let needRefresh = false // eslint-disable-line
                if (store.state.user.token) {
                    store.dispatch('setPageBeforeLogin')
                    needRefresh = true
                }
                await handleLogin()
                if (needRefresh) store.dispatch('retryLastPage')
                return
            case 405:
                toast({ title: '当前操作不被允许' })
                return Promise.reject(response.data.message)
            case 404:
                toast({ title: response.data.message })
                return Promise.reject(response.data.message)
            case 429:
                toast({ title: '请求过多，先休息一下吧' })
                return Promise.reject(response.data.message)
            case 500:
                toast({ title: '服务器打瞌睡了' })
                return Promise.reject(response.data.message)
            default:
                toast({ title: response.data.message })
                return Promise.reject(response.data.message)
        }
    },
    async error => {
        Toast.hide()
        const { statusCode } = error
        if (statusCode === 401 || statusCode === 403) {
            if (error.data.status === 201001) {
                return store.dispatch('logout')
            } else {
                let needRefresh = false // eslint-disable-line
                if (store.state.user.token) {
                    store.dispatch('setPageBeforeLogin')
                    needRefresh = true
                }
                await handleLogin()
                if (needRefresh) store.dispatch('retryLastPage')
                return
            }
        } else {
            toast({ title: '哎呀,发生了一点小问题😅' })
        }
        return Promise.reject(error)
    }
)

export { http }

