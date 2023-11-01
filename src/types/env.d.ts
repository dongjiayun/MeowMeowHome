// 使本文件成为环境声明
import ''

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development'
            UNI_PLATFORM: typeof __PLATFORM__
            WEBPACK_DEV_SERVING?: '1'
        }
    }
}
