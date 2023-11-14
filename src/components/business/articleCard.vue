<template>
    <view
        v-if="data"
        class="pa-article-card"
        @click="handleClick"
    >
        <uni-transition :duration="random(300,800)" :show="true" mode-class="fade">
            <image
                class="pa-article-card-image"
                :src="getThumb(cover,60)"
                mode="widthFix"
            />
            <view v-if="data.isPrivate" class="pa-article-card-private">私密</view>
            <view class="pa-article-card-info">
                <view class="pa-article-card-info-title">{{ data.title }}</view>
                <view class="pa-article-card-info-author">
                    <image class="pa-article-card-info-author-avatar" :src="getThumb(avatar)" />
                    <view class="pa-article-card-info-author-name">{{ data.author.username || '匿名猫猫' }}</view>
                </view>
                <view class="pa-article-card-info-time">
                    {{ dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
                </view>
                <view class="pa-article-card-info-data">
                    <view class="pa-article-card-info-data-item">
                        <uni-icons color="#FF824C" type="hand-up" size="16" />
                        <text>{{ likesCount }}</text>
                    </view>
                    <view class="pa-article-card-info-data-item">
                        <uni-icons color="#FF824C" type="star" size="16" />
                        <text>{{ collectCount }}</text>
                    </view>
                    <view class="pa-article-card-info-data-item">
                        <uni-icons color="#FF824C" type="chat" size="16" />
                        <text>{{ commentCount }}</text>
                    </view>
                </view>
            </view>
        </uni-transition>
    </view>
</template>

<script>
import { getThumb } from '@/utils/obs'
import { random } from 'lodash'
import { getRandomCover, toThousandsNum } from '@/utils'
import dayjs from 'dayjs'

export default {
    name: 'ArticleCard',
    props: {
        data: Object,
    },
    computed: {
        cover() {
            const cover = this.data.covers?.[0]?.fileUrl || getRandomCover()
            return cover
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
        }
    },
    methods: {
        dayjs,
        getThumb,
        random,
        handleClick() {
            this.$Router.push({
                name: 'articleDetail',
                query: {
                    articleId: this.data.articleId
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-article-card{
    border-radius: 16rpx;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    width: 352rpx;
    box-shadow:  0 0 16rpx 0 rgba(0, 0, 0, 0.1);
    &.stableSizeSmall{
        width: 230rpx;
    }
    &-image{
        width: 352rpx;
        &.stableSize{
            width: 336rpx;
        }
        &.stableSizeSmall{
            width: 230rpx;
        }
    }
    &-private{
        position: absolute;
        top: 0;
        left: 0;
        padding:8rpx;
        border-bottom-right-radius: 16rpx;
        background: #FFAA2C;
        color: #FFFFFF;
        backdrop-filter: blur(10px);
        opacity: 0.8;
    }
    &-info{
        padding:8rpx 16rpx 16rpx;
        background: #FFFFFF;
        &-title{
            font-size: 28rpx;
            font-weight: 400;
            color: #332C22;
            line-height: 36rpx;
            margin-bottom: 8rpx;
        }
        &-author{
            display: flex;
            align-items: center;
            &-avatar{
                height: 60rpx;
                width: 60rpx;
                border-radius: 60rpx;
                margin-right: 12rpx;
            }
            &-name{
                font-size: 24rpx;
                font-weight: 400;
                color: #332C22;
            }
        }
        &-time{
            margin-top: 4rpx;
            font-size: 20rpx;
            font-weight: 400;
            color: #ccc;
        }
        &-data{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 20rpx;
            &-item{
                font-size: 24rpx;
                display: flex;
                align-items: center;
                color:#FF824C;
                margin-right: 12rpx;
            }
        }
    }
}
</style>
