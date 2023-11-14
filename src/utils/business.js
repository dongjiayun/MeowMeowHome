import router from '@/router/router'

export const noticeJump = data => {
    switch (data.noticeType) {
        case 'collectArticle':
        case 'likeArticle':
            router.push({
                name: 'articleDetail',
                query: {
                    articleId: data.noticeCode
                }
            })
            break
    }
}
