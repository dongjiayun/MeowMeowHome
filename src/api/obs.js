import { http } from '@/utils/http'
import config from '@/config'

export const obsModel = {
    getSignature() {
        const bucket = config.obsBucket
        const bizKey = 'app-feedback' // app token只能上传图片和视频
        return http.get('/ipet/common/obs/getQiniuSign', { bucket, bizKey })
    }
}
