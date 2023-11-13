<template>
    <view
        class="pa-notice-bar"
        :class="{ active }"
        :style="{
            top: active ? `calc(16rpx + ${statusBarHeight}px)` : '-400rpx' }
        "
        @click="handleClick"
    >
        <view class="pa-notice-bar-avatar">
            <image mode="aspectFill" class="pa-notice-bar-avatar-image" :src="avatar" />
        </view>
        <view class="pa-notice-bar-info">
            <view class="pa-notice-bar-info-title">{{ notice.title }}</view>
            <view class="pa-notice-bar-info-text">{{ notice.content }}</view>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRandomCover } from '@/utils'

export default {
    props: {
        duration: {
            type: Number,
            default: 6000
        }
    },
    computed: {
        ...mapGetters(['statusBarHeight']),
        avatar() {
            return this.notice?.avatar?.fileUrl || getRandomCover()
        }
    },
    data() {
        return {
            active: false,
            notice: {}
        }
    },
    methods: {
        open() {
            this.active = true
            this.notice = this.$storage.get('pa_newest_notice')
            setTimeout(() => {
                this.active = false
            }, this.duration)
        },
        handleClick() {
            this.active = false
            switch (this.notice.noticeType) {
                case 'collectArticle':
                case 'likeArticle':
                    this.$Router.push({
                        name: 'articleDetail',
                        query: {
                            articleId: this.notice.noticeCode
                        }
                    })
                    break
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "@/styles";
.pa-notice-bar{
    position: fixed;
    width: 90vw;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s;
    opacity: 0;
    padding:20rpx;
    background: #fff;
    z-index: 99999;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    &.active{
        opacity: 1;
    }
    &-avatar{
        &-image{
            width: 96rpx;
            height: 96rpx;
            border-radius: 96rpx;
        }
        margin-right: 20rpx;
    }
    &-info{
        display: flex;
        flex-direction: column;
        justify-content: center;
        &-title{
            font-size: 32rpx;
            font-weight: 500;
            color: $pingan-color;
            margin-bottom: 8rpx;
        }
    }
}
</style>
