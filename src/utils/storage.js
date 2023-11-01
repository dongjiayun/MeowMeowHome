// 过期时间单位默认为天,如需其他单位,请传入对象{time:number,unit:string}
import dayjs from 'dayjs'
function setExpire(data, expire) {
    data = { data }
    if (expire) {
        if (typeof expire === 'string' || typeof expire === 'number') {
            data._expireTime = dayjs().add(+expire, 'd')
        } else if (typeof expire === 'object') {
            data._expireTime = dayjs().add(+expire.time, expire.unit)
        }
    }
    return data
}
function getData(key, res) {
    const { data, _expireTime } = res
    if (_expireTime) {
        if (dayjs(_expireTime).isAfter()) {
            return data
        } else {
            Storage.remove(key)
            return undefined
        }
    } else {
        return data
    }
}
export const Storage = {
    set(key, data, expire) {
        data = setExpire(data, expire)
        uni.setStorage({
            key,
            data,
        })
    },
    setAsync(key, data, expire) {
        data = setExpire(data, expire)
        return new Promise((resolve, reject) => {
            uni.setStorage({
                key,
                data,
                success(res) { resolve(res) },
                fail() { reject() }
            })
        })
    },
    get(key) {
        const res = uni.getStorageSync(key)
        return getData(key, res)
    },
    getAsync(key) {
        return new Promise((resolve, reject) => {
            uni.getStorage({
                key,
                success(res) { resolve(getData(key, res)) },
                fail() { reject() }
            })
        })
    },
    getAll() {
        return uni.getStorageInfoSync()
    },
    getAllAsync() {
        return new Promise((resolve, reject) => {
            uni.getStorageInfo({
                success(res) { resolve(res) },
                fail() { reject() }
            })
        })
    },
    remove(key) {
        return uni.removeStorageSync(key)
    },
    removeAsync(key) {
        return new Promise((resolve, reject) => {
            uni.removeStorage({
                key,
                success(res) { resolve(res) },
                fail() { reject() }
            })
        })
    },
    clear() {
        return uni.clearStorageSync()
    },
    clearAsync() {
        return new Promise((resolve, reject) => {
            uni.clearStorage({
                success(res) { resolve(res) },
                fail() { reject() }
            })
        })
    },
}
