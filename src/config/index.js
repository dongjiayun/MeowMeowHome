const CONFIG = {
    // 开发环境配置
    development: {
        // --------------dev------------------
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'https://o82q217872.zicp.fun', // 后台接口请求地址
        obsBaseUrl: 'https://upload-z2.qiniup.com',
        obsBucket: 'qa-ipet-res',
        obsDomain: 'qa-res.ipetapi.com',
        env: 'dev',
        // --------------prod------------------
        // assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://api.ipetapi.com', // 后台接口请求地址
        // obsBaseUrl: 'https://upload-z0.qiniup.com',
        // userPolicy: 'https://res.ipetapi.com//miniprogram/mall/userPolicy.html', // 用户协议
        // privacyPolicy: `https://res.ipetapi.com/miniprogram/mall/privacyPolicy.html`, // 隐私协议
        // aftersalePolicy: 'https://res.ipetapi.com/miniprogram/mall/aftersalePolicy.html', // 售后政策
        // couponPolicy: 'https://res.ipetapi.com/miniprogram/mall/couponPolicy.html', // 优惠券规则
        // giftCardPolicy: 'https://res.ipetapi.com/miniprogram/mall/giftcardPolicy.html', // 权益卡政策
        // activityPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/activityPolicy.html',
        // memberPolicy: 'https://res.ipetapi.com/miniprogram/mall/member_policy.html',
        // certification1: 'https://res.ipetapi.com/miniprogram/mall/1666064799616.jpg',
        // certification2: 'https://res.ipetapi.com/miniprogram/mall/1666064828326.jpg',
        // guideQrcode: 'https://res.ipetapi.com/miniprogram/mall/guideQrcode.png',
        // obsBucket: 'ipet-res',
        // obsDomain: 'res.ipetapi.com',
        // buriedRemark: 'v1',
        // env: 'prod',
        // ---------------qa----------------
        // assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://qa-api.ipetapi.com', // 后台接口请求地址
        // obsBaseUrl: 'https://upload-z2.qiniup.com',
        // userPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/userPolicy.html', // 用户协议
        // privacyPolicy: `https://qa-res.ipetapi.com/miniprogram/mall/privacyPolicy.html`, // 隐私协议
        // aftersalePolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/aftersalePolicy.html', // 售后政策
        // couponPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/couponPolicy.html', // 优惠券规则
        // giftCardPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/giftcardPolicy.html', // 权益卡政策
        // activityPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/activityPolicy.html',
        // memberPolicy: 'https://res.ipetapi.com/miniprogram/mall/member_policy.html',
        // certification1: 'https://qa-res.ipetapi.com/miniprogram/mall/1666064799616.jpg',
        // certification2: 'https://qa-res.ipetapi.com/miniprogram/mall/1666064828326.jpg',
        // guideQrcode: 'https://qa-res.ipetapi.com/miniprogram/mall/guideQrcode.png',
        // obsBucket: 'qa-ipet-res',
        // obsDomain: 'qa-res.ipetapi.com',
        // buriedRemark: 'v1',
        // env: 'qa',
    },
    // 生产环境配置
    production: {
        // --------------dev------------------
        // assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://dev-api.ipetapi.com', // 后台接口请求地址
        // obsBaseUrl: 'https://upload-z2.qiniup.com',
        // userPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/userPolicy.html', // 用户协议
        // privacyPolicy: `https://qa-res.ipetapi.com/miniprogram/mall/privacyPolicy.html`, // 隐私协议
        // aftersalePolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/aftersalePolicy.html', // 售后政策
        // couponPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/couponPolicy.html', // 优惠券规则
        // giftCardPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/giftcardPolicy.html', // 权益卡政策
        // activityPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/activityPolicy.html',
        // memberPolicy: 'https://res.ipetapi.com/miniprogram/mall/member_policy.html',
        // certification1: 'https://qa-res.ipetapi.com/miniprogram/mall/1666064799616.jpg',
        // certification2: 'https://qa-res.ipetapi.com/miniprogram/mall/1666064828326.jpg',
        // guideQrcode: 'https://qa-res.ipetapi.com/miniprogram/mall/guideQrcode.png',
        // obsBucket: 'qa-ipet-res',
        // obsDomain: 'qa-res.ipetapi.com',
        // buriedRemark: 'v1',
        // env: 'dev',
        // --------------prod------------------
        // assetsPath: '/static', // 静态资源路径
        // baseUrl: 'https://api.ipetapi.com', // 后台接口请求地址
        // obsBaseUrl: 'https://upload-z0.qiniup.com',
        // userPolicy: 'https://res.ipetapi.com/miniprogram/mall/userPolicy.html', // 用户协议
        // privacyPolicy: `https://res.ipetapi.com/miniprogram/mall/privacyPolicy.html`, // 隐私协议
        // aftersalePolicy: 'https://res.ipetapi.com/miniprogram/mall/aftersalePolicy.html', // 售后政策
        // couponPolicy: 'https://res.ipetapi.com/miniprogram/mall/couponPolicy.html', // 优惠券规则
        // giftCardPolicy: 'https://res.ipetapi.com/miniprogram/mall/giftcardPolicy.html', // 权益卡政策
        // memberPolicy: 'https://res.ipetapi.com/miniprogram/mall/member_policy.html',
        // activityPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/activityPolicy.html',
        // certification1: 'https://res.ipetapi.com/miniprogram/mall/1666064799616.jpg',
        // certification2: 'https://res.ipetapi.com/miniprogram/mall/1666064828326.jpg',
        // guideQrcode: 'https://res.ipetapi.com/miniprogram/mall/guideQrcode.png',
        // obsBucket: 'ipet-res',
        // obsDomain: 'res.ipetapi.com',
        // buriedRemark: 'v1',
        // env: 'prod',
        // --------------qa------------------
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'https://qa-api.ipetapi.com', // 后台接口请求地址
        obsBaseUrl: 'https://upload-z2.qiniup.com',
        userPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/userPolicy.html', // 用户协议
        privacyPolicy: `https://qa-res.ipetapi.com/miniprogram/mall/privacyPolicy.html`, // 隐私协议
        aftersalePolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/aftersalePolicy.html', // 售后政策
        couponPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/couponPolicy.html', // 优惠券规则
        giftCardPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/giftcardPolicy.html', // 权益卡政策
        memberPolicy: 'https://res.ipetapi.com/miniprogram/mall/member_policy.html',
        activityPolicy: 'https://qa-res.ipetapi.com/miniprogram/mall/activityPolicy.html',
        certification1: 'https://qa-res.ipetapi.com/miniprogram/mall/1666064799616.jpg',
        certification2: 'https://qa-res.ipetapi.com/miniprogram/mall/1666064828326.jpg',
        guideQrcode: 'https://qa-res.ipetapi.com/miniprogram/mall/guideQrcode.png',
        obsBucket: 'qa-ipet-res',
        obsDomain: 'qa-res.ipetapi.com',
        buriedRemark: 'v1',
        env: 'qa',
    },
}
export default CONFIG[process.env.NODE_ENV]
