// 使本文件成为环境声明
import ''

declare global {
    /* eslint-disable @typescript-eslint/naming-convention */
    const __PLATFORM__: 'app-plus' | 'h5' | 'mp-360' | 'mp-alipay' | 'mp-baidu' | 'mp-kuaishou' | 'mp-qq' | 'mp-toutiao' | 'mp-weixin' | 'quickapp-native' | 'quickapp-webview' | 'quickapp-webview-huawei' | 'quickapp-webview-union'
    /** 当前是否为 App 平台 */
    const __APP_PLUS__: boolean
    /** 当前是否为 H5 平台 */
    const __H5__: boolean
    /** 当前是否为 360 小程序平台 */
    const __MP_360__: boolean
    /** 当前是否为支付宝小程序平台 */
    const __MP_ALIPAY__: boolean
    /** 当前是否为百度小程序平台 */
    const __MP_BAIDU__: boolean
    /** 当前是否为快手小程序平台 */
    const __MP_KUAISHOU__: boolean
    /** 当前是否为 QQ 小程序平台 */
    const __MP_QQ__: boolean
    /** 当前是否为字节跳动小程序平台 */
    const __MP_TOUTIAO__: boolean
    /** 当前是否为微信小程序平台 */
    const __MP_WEIXIN__: boolean
    /** 当前是否为{微信, 支付宝, 百度, 字节跳动, QQ, 360, 快手}小程序平台 */
    const __MP__: boolean
    /** 当前是否为快应用平台 */
    const __QUICKAPP_NATIVE__: boolean
    /** 当前是否为快应用通用（包含联盟、华为）平台 */
    const __QUICKAPP_WEBVIEW__: boolean
    /** 当前是否为快应用联盟平台 */
    const __QUICKAPP_WEBVIEW_UNION__: boolean
    /** 当前是否为快应用华为平台 */
    const __QUICKAPP_WEBVIEW_HUAWEI__: boolean
    /* eslint-enable @typescript-eslint/naming-convention */
}
