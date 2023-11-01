export const Cookie = {
    get(key) {
        const arr = document.cookie.split('; ')
        for (let i = 0; i < arr.length; i++) {
            const arr2 = arr[i].trim().split('=')
            if (arr2[0] === key) {
                return arr2[1]
            }
        }
        return ''
    },
    set(key, value, day) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (const i in setting) {
                const oDate = new Date()
                oDate.setDate(oDate.getDate() + day)
                document.cookie = i + '=' + setting[i] + ';expires=' + oDate.toGMTString()
            }
        } else {
            const oDate = new Date()
            oDate.setDate(oDate.getDate() + day)
            document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString()
        }
    },
    remove(key) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Array') {
            setting.forEach(key => {
                this.set(key, 1, -1)
            })
        } else {
            this.set(key, 1, -1)
        }
    }
}
