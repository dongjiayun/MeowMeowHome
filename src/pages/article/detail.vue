<template>
    <pa-container ref="container" is-page>
        <view class="pa-article-detail">
            <view class="pa-article-detail-header">
                <pa-navbar />
            </view>
            <view class="pa-article-detail-body">
                <banner :data="covers" />
                <view class="pa-article-detail-body-main">
                    <view class="pa-article-detail-body-main-title">
                        {{ data.title || '' }}
                    </view>
                    <view class="pa-article-detail-body-main-subtitle">
                        <view class="pa-article-detail-body-main-subtitle-author">
                            <image class="pa-article-detail-body-main-subtitle-author-avatar" :src="avatar" />
                            <view class="pa-article-detail-body-main-subtitle-author-username">{{ data.author.username || '匿名猫猫' }}</view>
                        </view>
                        <view class="pa-article-detail-body-main-subtitle-time">
                            发表于{{ dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
                        </view>
                    </view>
                    <view class="pa-article-detail-body-main-content">
                        <mp-html
                            ref="article"
                            :content="data.content"
                        />
                    </view>
                </view>
            </view>
            <pa-footer>
                <view v-if="isSelf" class="pa-article-detail-footer">
                    <button class="pa-mall-button" @click="handleDelete">
                        <text>删除</text>
                        <uni-icons type="trash" size="24" />
                    </button>
                    <button v-if="isPrivate" class="pa-mall-button" @click="handlePublic">
                        <text>设为公开</text>
                        <uni-icons type="eye" size="24" />
                    </button>
                    <button v-else class="pa-mall-button-plain" @click="handlePrivate">
                        <text>设为私密</text>
                        <uni-icons type="eye-slash" size="24" />
                    </button>
                </view>
                <view v-else class="pa-article-detail-footer">
                    <button v-if="isLike" class="pa-mall-button" @click="handleUnLike">
                        <text>取消点赞</text>
                        <uni-icons type="hand-up" size="24" />
                        <text>{{ likesCount }}</text>
                    </button>
                    <button v-else class="pa-mall-button-plain" @click="handleLike">
                        <text>点赞</text>
                        <uni-icons type="hand-up" size="24" />
                        <text>{{ likesCount }}</text>
                    </button>
                    <button v-if="isCollect" class="pa-mall-button" @click="handleUnCollect">
                        <text>取消收藏</text>
                        <uni-icons type="star" size="24" />
                        <text>{{ collectCount }}</text>
                    </button>
                    <button v-else class="pa-mall-button-plain" @click="handleCollect">
                        <text>收藏</text>
                        <uni-icons type="star" size="24" />
                        <text>{{ collectCount }}</text>
                    </button>
                    <button class="pa-mall-button" @click="handleComment">
                        <text>评论 </text>
                        <uni-icons type="chat" size="24" />
                        <text>{{ commentCount }}</text>
                    </button>
                </view>
            </pa-footer>
        </view>
        <pa-logo hide-logo double-bottom-padding />
    </pa-container>
</template>

<script>
import banner from '@/pages/article/components/banner.vue'
import { getRandomCover, toThousandsNum } from '@/utils'
import { articleModel } from '@/api'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import mpHtml from '@/components/mp-html/mp-html.vue'

export default {
    components: {
        mpHtml,
        banner
    },
    data() {
        return {
            articleId: '',
            data: {},
            isLike: false,
            isCollect: false
        }
    },
    onLoad({ articleId }) {
        this.articleId = articleId
    },
    onPullDownRefresh() {
        this.init()
    },
    computed: {
        ...mapGetters(['token', 'cid']),
        covers() {
            return this.data?.covers?.map(i => i.fileUrl) || [getRandomCover()]
        },
        avatar() {
            return this.data.author?.avatar?.fileUrl || getRandomCover()
        },
        likesCount() {
            return toThousandsNum(this.data.likesCount || 0, 0)
        },
        collectCount() {
            return toThousandsNum(this.data.collectCount || 0, 0)
        },
        commentCount() {
            return toThousandsNum(this.data.commentCount || 0, 0)
        },
        isSelf() {
            return this.cid === this.data?.author?.cid
        },
        isPrivate() {
            return this.data.isPrivate
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        dayjs,
        init() {
            this.getDetail()
        },
        getDetail() {
            this.$message.loading()
            articleModel.get(this.articleId).then(res => {
                if (res.status === 0) {
                    this.data = res.data
                    this.checkLikeAndCollect()
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
                uni.stopPullDownRefresh()
            })
        },
        checkLikeAndCollect() {
            if (!this.token) {
                return
            }
            articleModel.checkLikeAndCollect(this.articleId).then(res => {
                if (res.status === 0) {
                    this.isLike = res.data.isLike
                    this.isCollect = res.data.isCollect
                }
            })
        },
        handleLike() {
            this.$message.loading()
            articleModel.like(this.articleId).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '谢谢铁汁的双击666👍🏻~' })
                    this.isLike = true
                    this.data.likesCount += 1
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleCollect() {
            this.$message.loading()
            articleModel.collect(this.articleId).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '收藏成功~' })
                    this.isCollect = true
                    this.data.collectCount += 1
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleUnLike() {
            this.$message.loading()
            articleModel.unLike(this.articleId).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '取消成功~' })
                    this.isLike = false
                    this.data.likesCount -= 1
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleUnCollect() {
            this.$message.loading()
            articleModel.unCollect(this.articleId).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '取消成功~' })
                    this.isCollect = false
                    this.data.collectCount -= 1
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleComment() {

        },
        handlePrivate() {
            this.$refs.container.showConfirm({
                content: '确定要设为私密吗?',
                confirm: () => {
                    const params = {
                        articleId: this.articleId,
                        isPrivate: true
                    }
                    this.$message.loading()
                    articleModel.setPrivate(params).then(res => {
                        if (res.status === 0) {
                            this.$toast({ title: '设置成功~' })
                            this.getDetail()
                        } else {
                            this.$toast({ title: res.message })
                        }
                    }).finally(() => {
                        this.$message.hide()
                    })
                }
            })
        },
        handlePublic() {
            this.$refs.container.showConfirm({
                content: '确定要设为公开吗?',
                confirm: () => {
                    const params = {
                        articleId: this.articleId,
                        isPrivate: false
                    }
                    this.$message.loading()
                    articleModel.setPrivate(params).then(res => {
                        if (res.status === 0) {
                            this.$toast({ title: '设置成功~' })
                            this.getDetail()
                        } else {
                            this.$toast({ title: res.message })
                        }
                    }).finally(() => {
                        this.$message.hide()
                    })
                }
            })
        },
        handleDelete() {
            this.$refs.container.showConfirm({
                content: '确定要删除这篇文章吗😲?',
                confirm: () => {
                    this.$message.loading()
                    articleModel.deleteArticle(this.articleId).then(res => {
                        if (res.status === 0) {
                            this.$toast({ title: '删除成功~' })
                            setTimeout(() => {
                                this.$Router.back()
                            }, 1000)
                        } else {
                            this.$toast({ title: res.message })
                        }
                    }).finally(() => {
                        this.$message.hide()
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-article-detail{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
    }
    &-body{
        &-main{
            margin: 0 16rpx 16rpx;
            padding: 16rpx;
            background: #FFFFFF;
            border-radius: 16rpx;
            &-title{
                font-size: 36rpx;
                margin-bottom: 8rpx;
            }
            &-subtitle{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20rpx;
                &-author{
                    display: flex;
                    align-items: center;
                    &-avatar{
                        height: 40rpx;
                        width: 40rpx;
                        border-radius: 60rpx;
                        margin-right: 8rpx;
                    }
                    &-username{
                        font-size: 24rpx;
                        font-weight: 400;
                        color: #332C22;
                    }
                }
                &-time{
                    font-size: 20rpx;
                    font-weight: 400;
                    color: #ccc;
                }
            }
            &-content{
                font-size: 28rpx;
            }
        }
    }
    &-footer{
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
}
</style>
