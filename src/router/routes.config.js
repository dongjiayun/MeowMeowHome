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
        path: 'pages/message/index',
        name: 'message',
        tabbarName: '留言板',
        isTabbar: true,
        tabActiveIcon: require('static/tabbar/cart_active.png'),
        tabInactiveIcon: require('static/tabbar/cart.png'),
    }
]

const notice = [
    {
        path: 'pages/notice/index',
        name: 'notice',
        tabbarName: '消息',
        isTabbar: true,
        bind: 'noticeAmount',
        isPush: true,
        tabActiveIcon: require('static/tabbar/category_active.png'),
        tabInactiveIcon: require('static/tabbar/category.png')
    }
]

const mine = [
    {
        path: 'pages/mine/member/index',
        name: 'mine',
        tabbarName: '我的',
        isTabbar: true,
        tabActiveIcon: require('static/tabbar/mine_active.png'),
        tabInactiveIcon: require('static/tabbar/mine.png')
    },
    {
        path: 'pages/mine/member/config',
        name: 'memberConfig'
    },
    {
        path: 'pages/mine/member/editNickname',
        name: 'memberEditNickname'
    },
    {
        path: 'pages/mine/member/loginByPassword',
        name: 'loginByPassword'
    },
    {
        path: 'pages/mine/member/signUp',
        name: 'signUp'
    },
    {
        path: 'pages/mine/member/editPassword',
        name: 'editPassword'
    },
    {
        path: 'pages/mine/member/findBackPassword',
        name: 'findBackPassword'
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
    },
    {
        path: 'pages/common/about',
        name: 'about'
    }
]

const user = [
    {
        path: 'pages/user/index',
        name: 'user'
    }
]

const comment = [
    {
        path: 'pages/comment/index',
        name: 'comment'
    }
]

const message = [
    {
        path: 'pages/message/index',
        name: 'message'
    }
]

const resumes = [
    {
        path: 'pages/resumes/index',
        name: 'resumes'
    }
]

const routes = [
    ...base,
    ...mall,
    ...notice,
    ...mine,
    ...article,
    ...common,
    ...user,
    ...comment,
    ...message,
    ...resumes
]

export default routes
