import { http } from '@/utils/http'

export const articleModel = {
    list(data) {
        return http.post('/article/get', data)
    },
    get(articleId) {
        return http.get(`/article/${articleId}`)
    },
    like(articleId) {
        return http.post(`/article/like/${articleId}`)
    },
    collect(articleId) {
        return http.post(`/article/collect/${articleId}`)
    }
}

export const authModel = {
    login(data) {
        return http.post('/auth/signIn', data)
    },
    refresh() {
        return http.post('/auth/refreshToken')
    }
}

