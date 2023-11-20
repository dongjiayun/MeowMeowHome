const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

const resolve = (dir) => require('path').join(__dirname, dir)

module.exports = {
    devServer: {
        port: 9010,
        // proxy: {
        //     // 后台接口代理
        //     '/api': {
        //         target: 'http://dev-api.ipetapi.com',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    },
    publicPath: '',
    productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
    css: {
    // requireModuleExtension: true, // 是否开启CSSmodule并保留xxx.module.css后缀
        loaderOptions: {
            less: {
                javascriptEnabled: true
            },
        },
    },
    chainWebpack: (config) => {
    // 配置相关loader，支持修改，添加和替换相关的loader
        config.resolve.alias.set('@', resolve('src'))
        config.resolve.alias.set('@root', resolve('./'))
        config
            .plugin('define')
            .tap(([def]) => [{
                ...def,
                'process.env.WEBPACK_DEV_SERVING': JSON.stringify(process.env.WEBPACK_DEV_SERVING)
            }])
            .tap(([def]) => [{
                ...def,
                __PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM),
                __APP_PLUS__: JSON.stringify(process.env.UNI_PLATFORM === 'app-plus'),
                __H5__: JSON.stringify(process.env.UNI_PLATFORM === 'h5'),
                __MP_360__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-360'),
                __MP_ALIPAY__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-alipay'),
                __MP_BAIDU__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-baidu'),
                __MP_KUAISHOU__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-kuaishou'),
                __MP_QQ__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-qq'),
                __MP_TOUTIAO__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-toutiao'),
                __MP_WEIXIN__: JSON.stringify(process.env.UNI_PLATFORM === 'mp-weixin'),
                __MP__: JSON.stringify(['mp-360', 'mp-alipay', 'mp-baidu', 'mp-kuaishou', 'mp-qq', 'mp-toutiao', 'mp-weixin'].includes(process.env.UNI_PLATFORM)),
                __QUICKAPP_NATIVE__: JSON.stringify(process.env.UNI_PLATFORM === 'quickapp-native'),
                __QUICKAPP_WEBVIEW__: JSON.stringify(['quickapp-webview', 'quickapp-webview-huawei', 'quickapp-webview-union'].includes(process.env.UNI_PLATFORM)),
                __QUICKAPP_WEBVIEW_UNION__: JSON.stringify(process.env.UNI_PLATFORM === 'quickapp-webview-huawei'),
                __QUICKAPP_WEBVIEW_HUAWEI__: JSON.stringify(process.env.UNI_PLATFORM === 'quickapp-webview-union')
            }])
            .end()
        // 发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            const compress = args[0].terserOptions.compress
            // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
            compress.drop_console = true
            compress.pure_funcs = [
                '__f__', // App 平台 vue 移除日志代码
                // 'console.debug' // 可移除指定的 console 方法
            ]
            return args
        })
    },
    transpileDependencies: ['@dcloudio/uni-ui'],
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
        }
        config.plugins.push(
            new webpack.DefinePlugin({
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'aliasPath']
                    })
                    return JSON.stringify(tfPages.routes)
                }, true)
            })
        )
        /* eslint-enable indent, @typescript-eslint/indent, editorconfig/indent */
    },
}
