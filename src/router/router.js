import VueRouter from 'vue-router'
import routes from './routes.config'
import { whiteList } from '@/config/router'
import { Storage } from '@/utils/storage'
import store from '@/store'
import { isNullOrEmpty } from '../utils'

const router = new VueRouter({
    mode: 'history'
})

const findObj = (arr, val, key = 'prop') => {
    let index
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            index = i
            break
        }
    }
    return index
}

const beforeEach = (target, name, descriptor) => {
    const method = descriptor.value
    descriptor.value = function(...args) {
        if (store.state.app.routerLocked) return
        const route = args[0]
        const router = new Router()
        router.checkRouterAvailable(route) ? method.apply(this, args) : router.push({ name: '404' })
    }
}

class Router {
    @beforeEach
    push(to) {
        const { href } = this.getRouter(to)
        uni.navigateTo({ url: href })
    }

    @beforeEach
    redirectTo(to) {
        const { href } = this.getRouter(to)
        uni.redirectTo({ url: href, fail(e) { console.log(e) } })
    }

    @beforeEach
    reLaunch(to) {
        const { href } = this.getRouter(to)
        uni.reLaunch({ url: href })
    }

    @beforeEach
    switchTab(to) {
        const { href } = this.getRouter(to)
        uni.switchTab({ url: href })
    }

    @beforeEach
    relaunchBaseOnHomePage(to) {
        const { href } = this.getRouter(to)
        const index = this.getRouter({ name: 'index' })
        uni.reLaunch({ url: index.href, success: () => {
            setTimeout(() => {
                uni.navigateTo({ url: href })
            }, 200)
        } })
    }

    back(delta) {
        uni.navigateBack({
            delta
        })
    }

    openBlowser(to) {
        window.open(to, '_blank')
    }

    blank(to) {
        to = encodeURIComponent(to)
        uni.navigateTo({
            url: '/pages/common/webView?url=' + to
        })
    }

    quit() {
        this.push({ name: 'index' })
    }

    setRouteCache() {
        const route = window.location.pathname + window.location.search
        Storage.set('pa-route-cache', route)
    }

    getRouteCache() {
        return Storage.get('pa-route-cache') || '/'
    }

    checkRouterAvailable({ name, path }) {
        let routeName
        if (whiteList.includes('ALL')) {
            return true
        }
        if (name) {
            routeName = name
        } else if (path) {
            console.log('path:' + path)
            const route = routes.find(i => i.path === path)
            console.log('route:' + JSON.stringify(route))
            if (route) {
                routeName = route[0].name
            } else {
                this.push({ name: '404' })
                return false
            }
        } else {
            this.push({ name: '404' })
            return false
        }
        if (whiteList.includes(routeName)) {
            console.log('Yes!!!!!!!!!!!!!!')
            return true
        } else {
            this.push({ name: '404' })
            return false
        }
    }

    getRouter(to) {
        if (typeof to === 'string') {
            return { href: to }
        } else {
            if (to.path) {
                const { query, param, path } = to
                return router.resolve({
                    query, param, path
                })
            } else if (to.name) {
                const { path } = routes[findObj(routes, to.name, 'name')]
                const { query, param } = to
                return router.resolve({
                    query, param, path
                })
            }
        }
    }

    getCurrentRouteName() {
        const pages = getCurrentPages()
        const currentRoute = pages[pages.length - 1].route
        const route = routes[findObj(routes, currentRoute, 'path')]
        return route.name
    }

    getRouterByName(name) {
        const route = routes[findObj(routes, name, 'name')]
        return route.path
    }

    getCurrentRoutePath() {
        const pages = getCurrentPages()
        const currentRoute = pages[pages.length - 1].route
        return currentRoute
    }

    checkCurrentRouteIsTabbar() {
        const pages = getCurrentPages()
        const path = pages[pages.length - 1]?.route
        const route = routes[findObj(routes, path, 'path')]
        return route.isTabbar
    }

    checkCurrentRouteHideTabbarShadow() {
        const pages = getCurrentPages()
        const currentRoute = pages[pages.length - 1].route
        const route = routes[findObj(routes, currentRoute, 'path')]
        return route.hideTabbarShadow
    }

    checkCurrentRouteActive(path) {
        const pages = getCurrentPages()
        const currentRoute = pages[pages.length - 1].route
        return path === currentRoute
    }

    getCurrentRouteQuery() {
        const pages = getCurrentPages()
        const currentRoute = pages[pages.length - 1]
        return currentRoute.options
    }

    resolve({ name, path, query = {}}) {
        let _path = ''
        if (name) {
            _path = this.getRouterByName(name)
        } else if (path) {
            _path = path
        }
        const _query = Object.entries(query).filter(([key, value]) => {
            return !isNullOrEmpty(value)
        }).map(([key, value]) => {
            return `${key}=${value}`
        }).join('&')
        return [_path, _query].filter(Boolean).join('?')
    }
    getRouteQuery() {
        const routes = getCurrentPages()
        const curParam = routes[routes.length - 1]?.options
        return curParam
    }
}

export default new Router()
