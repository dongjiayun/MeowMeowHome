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
        path: 'pages/mall/index',
        name: 'mall',
        tabbarName: '购物',
        isTabbar: true,
        tabActiveIcon: require('static/tabbar/cart_active.png'),
        tabInactiveIcon: require('static/tabbar/cart.png')
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
    ...common,
]

export default routes
