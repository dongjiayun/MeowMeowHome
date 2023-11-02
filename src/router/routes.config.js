const base = [
    {
        path: 'pages/index/index',
        name: 'index'
    },
    {
        path: 'pages/home/index',
        name: 'home',
        tabbarName: '首页',
        isTabbar: true,
        tabActiveIcon: require('static/tabbar/home_active.png'),
        tabInactiveIcon: require('static/tabbar/home.png')
    }
]

const mall = [
    {
        path: 'pages/index/index',
        name: 'mall',
        tabbarName: '购物',
        isTabbar: true,
        tabActiveIcon: require('static/tabbar/cart_active.png'),
        tabInactiveIcon: require('static/tabbar/cart.png'),
        openMiniprogram: true,
        appId: 'wx284a972db321f04f'
    }
]

const notice = [
    {
        path: 'pages/notice/index',
        name: 'notice',
        tabbarName: '消息',
        isTabbar: true,
        bind: 'noticeAmount',
        tabActiveIcon: require('static/tabbar/category_active.png'),
        tabInactiveIcon: require('static/tabbar/category.png')
    }
]

const mine = [
    {
        path: 'pages/mine/index',
        name: 'mine',
        tabbarName: '我的',
        isTabbar: true,
        tabActiveIcon: require('static/tabbar/mine_active.png'),
        tabInactiveIcon: require('static/tabbar/mine.png')
    },
    {
        path: 'pages/mine/loginByPassword',
        name: 'loginByPassword'
    },
    {
        path: 'pages/mine/signUp',
        name: 'signUp'
    }
]

const article = [
    {
        path: 'pages/article/detail',
        name: 'articleDetail',
    },
    {
        path: 'pages/article/editor',
        name: 'articleEditor'
    }
]

const common = [
    {
        path: 'pages/common/board',
        name: 'blackBoard'
    },
    {
        path: 'pages/common/webView',
        name: 'webView'
    },
    {
        path: 'pages/common/404',
        name: '404'
    },
    {
        path: 'pages/common/search',
        name: 'search'
    },
    {
        path: 'pages/common/videoPreview',
        name: 'videoPreview'
    }
]

const routes = [
    ...base,
    ...mall,
    ...notice,
    ...mine,
    ...article,
    ...common,
]

export default routes
