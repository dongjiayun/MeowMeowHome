import { http } from '@/utils/http'
import config from '@/config'

export const obsModel = {
    getSignature() {
        const bucket = config.obsBucket
        return http.post('/common/obsToken', { bucket })
    }
}
