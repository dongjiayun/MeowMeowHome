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
        case 'follow':
            router.push({
                name: 'user',
                query: {
                    cid: data.noticeCode
                }
            })
            break
        case 'article':
            router.push({
                name: 'articleDetail',
                query: {
                    articleId: data.noticeCode
                }
            })
            break
        case 'comment':
            if (data.noticeCode.includes('Article')) {
                router.push({
                    name: 'articleDetail',
                    query: {
                        articleId: data.noticeCode.split('|')?.[1],
                    }
                })
            } else {
                router.push({
                    name: 'comment',
                    query: {
                        articleId: data.noticeCode.split('|')?.[1],
                    }
                })
            }
            break
        case 'likeComment':
            router.push({
                name: 'comment',
                query: {
                    articleId: data.noticeCode.split('|')?.[1]
                }
            })
    }
}
