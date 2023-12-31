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
    },
    setPrivate(data) {
        return http.post(`/article/private/${data.articleId}`, data)
    },
    deleteArticle(articleId) {
        return http.delete(`/article/${articleId}`)
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
    },
    resetPassword(data) {
        return http.post('/auth/resetPassword', data)
    },
    findbackPassword(data) {
        return http.post('/auth/findbackPassword', data)
    }
}

export const userModel = {
    info(cid) {
        return http.get(`/user/${cid}`)
    },
    update(data) {
        return http.put('/user', data)
    },
    myLikeArticles(data) {
        return http.post('/user/myLikeArticles', data)
    },
    myCollectArticles(data) {
        return http.post('/user/myCollectArticles', data)
    },
    checkFollow(data) {
        return http.post('/user/checkFollow', data)
    },
    follow(cid) {
        return http.post(`/user/follow/${cid}`)
    },
    unFollow(cid) {
        return http.delete(`/user/follow/${cid}`)
    },
    getFollows(data) {
        return http.post('/user/getFollows', data)
    },
    getFollowers(data) {
        return http.post('/user/getFollowers', data)
    }
}

export const noticeModel = {
    list(data) {
        return http.post('/notice/get', data)
    },
    amount() {
        return http.get(`/notice/amount`)
    },
    read(noticeId) {
        return http.put(`/notice/${noticeId}`)
    },
    readAll() {
        return http.put(`/notice/readAll`)
    }
}

export const commentModel = {
    list(data) {
        return http.post('/comment/get', data)
    },
    detail(commentId) {
        return http.get(`/comment/${commentId}`)
    },
    create(data) {
        return http.post('/comment', data)
    },
    edit(data) {
        return http.put('/comment', data)
    },
    delete(commentId) {
        return http.delete(`/comment/${commentId}`)
    },
    like(commentId) {
        return http.post(`/comment/like/${commentId}`)
    },
    unLike(commentId) {
        return http.delete(`/comment/like/${commentId}`)
    },
    getLikeComments(data) {
        return http.post('/comment/get/like', data)
    }
}

export const messageModel = {
    list(data) {
        return http.post('/message', data)
    },
    create(data) {
        return http.post('/message/create', data)
    },
    delete(messageId) {
        return http.delete(`/message/${messageId}`)
    },
    like(messageId) {
        return http.post(`/message/like/${messageId}`)
    },
    unLike(messageId) {
        return http.delete(`/message/like/${messageId}`)
    }
}
