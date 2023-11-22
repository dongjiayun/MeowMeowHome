const CONFIG = {
    // 开发环境配置
    local: {
        // --------------dev------------------
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://o82q217872.zicp.fun', // 后台接口请求地址
        baseUrl: 'https://www.meowmeowmeow.cn',
        obsBaseUrl: 'https://upload-z2.qiniup.com',
        obsBucket: 'qa-ipet-res',
        obsDomain: 'qa-res.ipetapi.com',
        env: 'dev',
    },
    dev: {
        // --------------dev------------------
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://o82q217872.zicp.fun', // 后台接口请求地址
        baseUrl: 'http://localhost:2000',
        obsBaseUrl: 'https://upload-z2.qiniup.com',
        obsBucket: 'qa-ipet-res',
        obsDomain: 'qa-res.ipetapi.com',
        env: 'dev',
    },
    qa: {
        // --------------dev------------------
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://o82q217872.zicp.fun', // 后台接口请求地址
        baseUrl: 'http://localhost:2000',
        obsBaseUrl: 'https://upload-z2.qiniup.com',
        obsBucket: 'qa-ipet-res',
        obsDomain: 'qa-res.ipetapi.com',
        env: 'dev',
    },
    // 生产环境配置
    prod: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'https://www.meowmeowmeow.cn', // 后台接口请求地址
        obsBaseUrl: 'https://upload-z2.qiniup.com',
        obsBucket: 'qa-ipet-res',
        obsDomain: 'qa-res.ipetapi.com',
        env: 'prod',
    },
}
export default CONFIG[process.env.VUE_APP_CURRENTMODE || 'local']
