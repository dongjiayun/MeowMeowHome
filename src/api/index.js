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
    },
    unLike(articleId) {
        return http.delete(`/article/like/${articleId}`)
    },
    unCollect(articleId) {
        return http.delete(`/article/collect/${articleId}`)
    },
    checkLikeAndCollect(articleId) {
        return http.get(`/article/checkLikeAndCollect/${articleId}`)
    },
    create(data) {
        return http.post('/article', data)
    },
    edit(data) {
        return http.put('/article', data)
    }
}

export const authModel = {
    login(data) {
        return http.post('/auth/signIn', data)
    },
    refresh() {
        return http.post('/auth/refreshToken')
    },
    sendEmailOtp(data) {
        return http.post('/auth/sendEmailOtp', data)
    },
    logout() {
        return http.post('/auth/signOut')
    }
}

export const userModel = {
    info(cid) {
        return http.get(`/user/${cid}`)
    },
    update(data) {
        return http.put('/user', data)
    }
}
