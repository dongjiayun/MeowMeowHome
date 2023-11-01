import { http } from '@/utils/http'

export const articleModel = {
    list(data) {
        return http.post('/article/get', data)
    }
}

export const authModel = {
    login(data) {
        return http.post('/auth/signIn', data)
    }
}
