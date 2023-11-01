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
    ...common,
]

export default routes
