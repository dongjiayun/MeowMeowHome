import Vue from 'vue'
import store from '@/store'
import dict from '@/config/dict'
import { floor, round } from 'lodash'
import { getCouponPackage } from '@/utils/mall'
import Config from '@/config'
import dayjs from 'dayjs'
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

// 格式化枚举
export function getDictLabelByVal(data, val, props = { value: 'value', label: 'label' }) {
    let result = ''
    if (val || val === 0) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item[props.value] === val) {
                    result = item[props.label]
                }
            })
        }
    }
    return result
}

export function getDictNameByVal(data, val, props = { value: 'value', label: 'name' }) {
    let result = ''
    if (val || val === 0) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item[props.value] === val) {
                    result = item[props.label]
                }
            })
        }
    }
    return result
}

export function getDictValueByLabel(data, val, props = { value: 'value', label: 'label' }) {
    let result = ''
    if (val || val === 0) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item[props.label] === val) {
                    result = item[props.value]
                }
            })
        }
    }
    return result
}

// 判空（0返回true）
export const isNullOrEmpty = function(val) {
    return val === null || val === undefined || val === ''
}

/**
 * toast提示
 */
export const toast = ({ title, duration, mask = false, icon = 'none' }) => {
    if (Boolean(title) === false) {
        return
    }
    setTimeout(() => {
        uni.showToast({
            title,
            duration: isNullOrEmpty(duration) ? 2000 : duration,
            mask,
            icon
        })
    }, 200)
}

export class Toast {
     hideTimeout = undefined
     loadingTimeout = undefined
     static info({ title, duration, mask, icon, image }) {
         setTimeout(() => {
             uni.showToast({
                 title,
                 duration: isNullOrEmpty(duration) ? 2000 : duration,
                 mask,
                 icon: 'none',
                 image
             })
         }, 200)
     }
     static success({ title, duration, mask }) {
         setTimeout(() => {
             uni.showToast({
                 title,
                 duration: isNullOrEmpty(duration) ? 1000 : duration,
                 mask,
                 icon: 'checkmarkempty'
             })
         }, 200)
     }
     static error({ title, duration, mask }) {
         setTimeout(() => {
             uni.showToast({
                 title,
                 duration: isNullOrEmpty(duration) ? 1000 : duration,
                 mask,
                 icon: 'error'
             })
         }, 200)
     }
     static hide() {
         if (this.hideTimeout) {
             clearTimeout(this.hideTimeout)
             this.hideTimeout = undefined
         }
         this.hideTimeout = setTimeout(() => {
             uni.hideToast()
             store.dispatch('hideLoading')
             clearTimeout(this.hideTimeout)
             this.hideTimeout = undefined
             clearTimeout(this.loadingTimeout)
             this.loadingTimeout = undefined
         }, 0)
     }
     static loading() {
         if (this.hideTimeout) {
             clearTimeout(this.hideTimeout)
             this.hideTimeout = undefined
         }
         if (this.loadingTimeout) {
             return
         }
         this.loadingTimeout = setTimeout(() => {
             store.dispatch('showLoading')
         }, 200)
     }
     static showLoading(title = '正在加载', mask = true) {
         uni.showLoading({
             title,
             mask
         })
     }
     static hideLoading() {
         uni.hide()
     }
}

export const dialog = ({ title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor }) => {
    title = title || ''
    content = content || ''
    showCancel = showCancel || true
    cancelText = cancelText || '取消'
    cancelColor = cancelColor || '#000000'
    confirmText = confirmText || '确定'
    confirmColor = confirmColor || '#576B95'
    return new Promise((resolve, reject) => {
        uni.showModal({
            title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor,
            success(res) {
                if (res.confirm) {
                    resolve(res)
                } else {
                    reject(res)
                }
            },
            fail(e) {
                reject(e)
            }
        })
    })
}

/**
 * 去除对象空元素
 */
export const objectTreeShake = obj => {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => !isNullOrEmpty(value)))
}

/**
 * 去除数组空元素
 */
export const arrayTreeShake = arr => {
    return arr.filter(i => !isNullOrEmpty(i))
}

export const toDuration = time => {
    let s = 0; let m = 0
    m = Math.floor(time / 60)
    s = time % 60
    return `${m}分${s}秒`
}

export const toDurationSimple = seconds => {
    var ss = parseInt(seconds)// 秒
    var mm = 0// 分
    var hh = 0// 小时
    if (ss > 60) {
        mm = parseInt(ss / 60)
        ss = parseInt(ss % 60)
    }
    if (mm > 60) {
        hh = parseInt(mm / 60)
        mm = parseInt(mm % 60)
    }
    var result = ('00' + parseInt(ss)).slice(-2)
    if (mm > 0) {
        result = ('00' + parseInt(mm)).slice(-2) + ':' + result
    } else {
        result = '00:' + result
    }
    result = ('00' + parseInt(hh)).slice(-2) + ':' + result
    return result
}

export const setObj = (target, prop, obj) => {
    if (target instanceof Vue) {
        Object.entries(obj).forEach(([key, value]) => {
            target.$set(target[prop], key, value)
        })
    }
}

export const hidePhone = phone => {
    if (!phone) {
        return ''
    } else {
        const _phone = String(phone)
        const start = _phone.substring(0, 3)
        const end = _phone.substring(7, 11)
        return `${start}****${end}`
    }
}

export const getSystemInfo = () => {
    return new Promise((resolve, reject) => {
        uni.getSystemInfo({
            success(e) {
                resolve(e)
            },
            fail(e) {
                reject(e)
            }
        })
    })
}

export const consoleLog = log => {
    console.log(log)
}

export const getDefaultAvatar = type => {
    return type ? (type === 1 ? require('./images/cat.png') : require('./images/dog.png')) : require('./images/default.png')
}

export const buriedPoint = (action, eventId, param) => {
    const actionEmu = [
        'enterPage', // 进入页面
        'exitPage', // 离开页面
        'observeClickAction' // 点击按钮
    ]
    let label = ''
    const title = getDictLabelByVal(dict.buriedPoint, eventId)
    switch (action) {
        case 0:
            label = '进入' + title
            break
        case 1:
            label = '离开' + title
            break
        default:
            label = title
    }
    const params = {
        action: actionEmu[action],
        title: label,
        eventId,
        param
    }
    // #ifdef APP-PLUS
    uni.sendNativeEvent('requestObservePageAction', JSON.stringify(params))
    // #endif

    // #ifdef H5
    console.log(label, param)
    // #endif
}

export const uuid = () => {
    return `${new Date().getTime().toString(16)}-${Math.round(Math.random() * 1e12).toString(16)}-${Math.round(Math.random() * 1e12).toString(16)}-${Math.round(Math.random() * 1e12).toString(16)}`
}

export const randomRange = (myMin, myMax) => {
    return Math.floor(Math.random() * (myMax - myMin + 1)) + myMin
}

export const listToPage = (data, pageSize) => {
    const list = []
    let currentIndex = 0
    data.forEach((i, inx) => {
        if (inx === currentIndex) {
            const slice = data.slice(currentIndex, currentIndex + pageSize)
            list.push(slice)
            currentIndex += pageSize
        }
    })
    return list
}

export function toThousandsNum(value, precision = 2) {
    if (isNaN(value) || value === null || value === undefined) { return '-' }
    return round(Number(value), precision).toFixed(precision).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export const toThousandsNumByPenny = (value, precision = 2) => {
    if (isNaN(value) || value === null || value === undefined) { return '-' }
    let isNegative = false
    if (value < 0) {
        isNegative = true
        value = -value
    }
    const num = floor(Number(value) / 100, precision).toFixed(precision)
    return isNegative ? `-${+num === 0 ? '0' : ''}` : '' + String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export const numberUnitFormat = (num, precision = 1, isInteger = true) => {
    if (isNullOrEmpty(num)) {
        return '-'
    }
    if (num < 10000) {
        return isInteger ? toThousandsNum(round(num, 0), 0) : toThousandsNum(round(num, precision), precision)
    } else if (num >= 10000 && num < 100000000) {
        return `${toThousandsNum(round((num / 10000), precision), precision)}w`
    } else if (num >= 100000000) {
        return `${toThousandsNum(round((num / 100000000), precision), precision)}亿`
    }
}

export const getDecimals = num => {
    const numstr = String(num)
    return numstr.length > 1 ? numstr.substring(numstr.length - 2, numstr.length) : numstr.length === 1 ? '0' + numstr.substring(numstr.length - 2, numstr.length) : '00'
}

export function getHMS(time) {
    const hour = parseInt(time / 3600) < 10 ? '0' + parseInt(time / 3600) : parseInt(time / 3600)
    const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
    const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
    return { hour, min, sec }
}

export function getYMD(time) {
    const date = dayjs(time).format('YYYY|MM|DD')
    const [year, month, day] = date.split('|')
    return { year, month, day }
}

export function getDHMS(time) {
    const day = parseInt(time / 3600 / 24)
    const hour = parseInt(time / 3600 % 24) < 10 ? '0' + parseInt(time / 3600 % 24) : parseInt(time / 3600 % 24)
    const min = parseInt(time % 3600 / 60) < 10 ? '0' + parseInt(time % 3600 / 60) : parseInt(time % 3600 / 60)
    const sec = parseInt(time % 3600 % 60) < 10 ? '0' + parseInt(time % 3600 % 60) : parseInt(time % 3600 % 60)
    return { day, hour, min, sec }
}

// 123499(分) => 1234.99(元) => 1,234(type为1，得千分位形式整数部分) + 99(type为2，得小数部分)
export const splitPennyNum = (type = 1, value) => {
    const arr = String(value / 100).split('.')
    const str = type === 1 ? arr[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : arr[1] ? arr[1] : '00'
    return str
}

export const priceToFix = price => {
    if (price % 100 === 0) {
        return round(price / 100)
    } else if (price % 10 === 0) {
        return round(price / 100, 1)
    } else {
        return round(price / 100, 2)
    }
}

export const query2Json = queryStr => {
    const _queryStr = queryStr.replace('?', '')
    const query = _queryStr.split('&')
    const result = {}
    query.forEach(i => {
        const [key, value] = i.split('=')
        result[key] = value
    })
    return result
}

export const truncateString = (str = '', maxLength = 16) => {
    if (typeof str !== 'string' || typeof maxLength !== 'number') {
        throw new TypeError('参数类型错误：请传入字符串和数字')
    }

    if (str.length > maxLength) {
        return str.slice(0, maxLength - 3) + '...'
    }

    return str
}

export const px2rpx = (px = '0px', hasUnit = true) => {
    const _px = hasUnit ? px.replace('px', '') : px
    const rpx = Number(_px) * 2 + 4
    return hasUnit ? `${rpx}rpx` : rpx
}

export const handleJumpByJumpType = ({ jumpType, jumpValue }) => {
    if (jumpValue.includes('__JUMP_PATH__')) {
        const [_, path] = jumpValue.split('|') //eslint-disable-line
        return Vue.prototype.$Router.push(path)
    }
    if (jumpType === 'COUPON') {
        return Vue.prototype.$Router.push({ name: 'getCoupon', query: { couponId: jumpValue }})
    }
    if (jumpType === 'TOPIC') {
        return Vue.prototype.$Router.push({ name: 'topic', query: { id: jumpValue }})
    }
    if (jumpType === 'PRODUCT_DETAIL') {
        return Vue.prototype.$Router.push({ name: 'goodsDetail', query: { productId: jumpValue }})
    }
    if (jumpType === 'SECKILL') {
        const [skuNo, productId, couponId, activityId] = jumpValue.split('|')
        return Vue.prototype.$Router.push({ name: 'goodsDetail', query: {
            skuNo, productId, couponId, activityId
        }})
    }
    if (jumpType === 'SECKILL_LIST') {
        return Vue.prototype.$Router.push({ name: 'secKill', query: { activityId: jumpValue }})
    }
    if (jumpType === 'ACTIVITY') {
        return Vue.prototype.$Router.push({ name: 'activityGoodsList', query: { id: jumpValue, IFA: '1' }})
    }
    if (jumpType === 'COUPON_PACKAGE') {
        return getCouponPackage(jumpValue)
    }
    if (jumpType === 'COUPON_PACKAGE_ACTIVITY') {
        return Vue.prototype.$Router.push({ name: 'getCouponPackage', query: { id: jumpValue }})
    }
    if (jumpType === 'MINIPROGRAM') {
        const [appId, path, extraData] = jumpValue.split('|')
        const _extraData = extraData?.split(';') || []
        const extraDataObj = {}
        _extraData.forEach(i => {
            const [key, value] = i.split('=')
            extraDataObj[key] = value
        })
        const envVersionMap = {
            'dev': 'trial',
            'qa': 'trial',
            'prod': 'release',
        }
        const envVersion = envVersionMap[Config.env]
        return uni.navigateToMiniProgram({
            appId,
            path,
            extraData: extraDataObj,
            envVersion
        })
    }
    if (jumpType === 'ACTIVITY_SELF_PICKUP') {
        return Vue.prototype.$Router.push({ name: 'activityGoodsListSelfPickup', query: { id: jumpValue }})
    }
    if (jumpType === 'EMBEDDED_MINIPROGRAM') {
        const [appId, path, extraData] = jumpValue.split('|')
        const _extraData = extraData?.split(';') || []
        const extraDataObj = {}
        _extraData.forEach(i => {
            const [key, value] = i.split('=')
            extraDataObj[key] = value
        })
        const envVersionMap = {
            'dev': 'trial',
            'qa': 'trial',
            'prod': 'release',
        }
        const envVersion = envVersionMap[Config.env]
        return uni.openEmbeddedMiniProgram({
            appId,
            path,
            extraData: extraDataObj,
            envVersion,
            fail: (e) => {
                uni.openEmbeddedMiniProgram({
                    appId,
                    path,
                    extraData: extraDataObj,
                    envVersion,
                })
            }
        })
    }
    if (jumpType === 'NEW_USER') {
        return Vue.prototype.$Router.push({ name: 'newUser', query: { id: jumpValue }})
    }
}

export const getAge = birthday => {
    const diff = round(dayjs.duration(dayjs().diff(dayjs(birthday))).as('years'), 1)
    const [year, month] = diff.toString().split('.')
    return `${year}岁${month ? month + '个月' : ''}`
}

export const debounce = (func, delay = 200) => {
    let timer = null
    return function(...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
