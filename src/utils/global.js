import { formatThousandsNum } from './filters'
import { isNullOrEmpty, getDictLabelByVal, toast, objectTreeShake, arrayTreeShake, dialog, setObj, Toast, getDictNameByVal, consoleLog, getDictValueByLabel, buriedPoint } from './index'
import { Storage } from '@/utils/storage'
import { getToken, login, checkLogin } from '@/utils/auth'
import { track } from '@/utils/sensor'
import { getDict } from './dict'

export default {
    install(Vue) {
        Vue.prototype.$toThousandsNum = (value, ...args) => formatThousandsNum(value, false, ...args) ?? '-'

        // 数组中匹配特定对象，返回其index
        Vue.prototype.$findObj = function(arr, val, key = 'prop') {
            let index
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][key] === val) {
                    index = i
                    break
                }
            }
            return index
        }
        Vue.prototype.$isNullOrEmpty = isNullOrEmpty

        Vue.prototype.$getDictLabelByVal = getDictLabelByVal

        Vue.prototype.$getDictValueByLabel = getDictValueByLabel

        Vue.prototype.$getDictNameByVal = getDictNameByVal

        Vue.prototype.$getUrlSearch = (k, url = location.href) => {
            let u
            if (typeof url === 'string') {
                u = url
            } else {
                u = u?.route
            }
            const result = {}
            const query = u.split('?')[1]
            const queryArr = query.split('&')
            queryArr.forEach(item => {
                const value = item.split('=')[1]
                const key = item.split('=')[0]
                result[key] = value
            })
            return k ? result[k] : result
        }

        Vue.prototype.$toast = toast

        Vue.prototype.$message = Toast

        Vue.prototype.$dialog = dialog

        Vue.prototype.$objectTreeShake = objectTreeShake

        Vue.prototype.$arrTreeShake = arrayTreeShake

        Vue.prototype.$storage = Storage

        Vue.prototype.$setObj = setObj

        Vue.prototype.$consoleLog = consoleLog

        Vue.prototype.$getDict = getDict

        Vue.prototype.$timeFormat = 'YYYY-MM-DDTHH:mm:ssZZ'

        Vue.prototype.$buriedPoint = buriedPoint

        Vue.prototype.$login = login

        Vue.prototype.$getToken = getToken

        // Vue.prototype.$sensors = initSensors()

        Vue.prototype.$track = track

        Vue.prototype.$checkLogin = checkLogin
    }
}
