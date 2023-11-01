import { Toast, uuid } from '@/utils'
import store from '@/store'
import appConfig from '@/config'

export function upload({ data, module, formatFileNameByUuid = true, customFileName }) {
    const file = data
    const fileName = file?.name || file.path
    let key
    if (customFileName) {
        key = `${module}/${customFileName}`
    } else if (formatFileNameByUuid) {
        let fileType = fileName.split('.')
        fileType = fileType[fileType.length - 1]
        const _fileName = uuid() + `.${fileType}`
        key = `${module}/${_fileName}`
    } else {
        key = `${module}/${fileName}`
    }
    const obsInfo = store.state.app.obsInfo
    const { token } = obsInfo
    const cdnDomain = appConfig.obsDomain
    Toast.showLoading('正在上传')
    return qiniuUpload(file, key, token).then(res => {
        Toast.hide()
        const filePath = `https://${cdnDomain}/${key}`
        Toast.info({ title: '上传成功' })
        console.log(filePath)
        return ({ filePath, data })
    }).catch(err => {
        if (err.code === 614) {
            Toast.info({ title: '文件已存在,请登录obs后台,删除同名文件后再上传' })
        } else {
            Toast.info({ title: '上传失败,请重试' })
        }
        Toast.hide()
    })
}

export function getThumb(url, quality = 20) {
    if (url) {
        return `${url}?imageView2/0/w/600/h/600/format/jpg/q/${quality}`
    } else {
        ''
    }
}

export function urlToBlob(url) {
    console.log('url:' + url)
    return new Promise(resolve => {
        uni.request({
            url,
            responseType: 'arraybuffer',
            success(res) {
                resolve(res.data)
            }
        })
    })
}

export async function qiniuUpload(file, key, token) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: appConfig.obsBaseUrl,
            filePath: file.path,
            name: 'file',
            formData: {
                key: key,
                token: token,
            },
            success(data) {
                resolve(data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
