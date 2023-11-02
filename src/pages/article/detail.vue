<template>
    <pa-container is-page>
        <view class="pa-article-detail">
            <view class="pa-article-detail-header">
                <pa-navbar />
            </view>
            <view class="pa-article-detail-body">
                <banner :data="covers" />
                <view class="pa-article-detail-body-main">
                    <view class="pa-article-detail-body-main-title">
                        {{ data.title }}
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
                        <rich-text :nodes="data.content" />
                    </view>
                </view>
            </view>
            <pa-footer>
                <view class="pa-article-detail-footer">
                    <button class="pa-mall-button" @click="handleLike">
                        <text>点赞</text>
                        <uni-icons type="hand-up" size="24" />
                    </button>
                    <button class="pa-mall-button" @click="handleCollect">
                        <text>收藏</text>
                        <uni-icons type="paperclip" size="24" />
                    </button>
                    <button class="pa-mall-button" @click="handleComment">
                        <text>评论</text>
                        <uni-icons type="chat" size="24" />
                    </button>
                </view>
            </pa-footer>
        </view>
    </pa-container>
</template>

<script>
import banner from '@/pages/article/components/banner.vue'
import { getRandomCover } from '@/utils'
import { articleModel } from '@/api'
import dayjs from 'dayjs'

export default {
    components: {
        banner
    },
    data() {
        return {
            articleId: '',
            data: {}
        }
    },
    onLoad({ articleId }) {
        this.articleId = articleId
    },
    onPullDownRefresh() {
        this.init()
    },
    computed: {
        covers() {
            return this.data?.covers?.map(i => i.fileUrl) || [getRandomCover()]
        },
        avatar() {
            return this.data.author?.avatar?.fileUrl || getRandomCover()
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
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
                uni.stopPullDownRefresh()
            })
        },
        handleLike() {
            this.$message.loading()
            articleModel.like(this.articleId).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '谢谢铁汁的双击666👍🏻~' })
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
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleComment() {

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
        justify-content: space-between;
    }
}
</style>
