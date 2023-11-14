<template>
    <view class="pa-notice-card" @click="handleDetail">
        <image class="pa-notice-card-avatar" :src="avatar" />
        <view class="pa-notice-card-info">
            <view class="pa-notice-card-info-title">{{ data.title || '' }}</view>
            <view class="pa-notice-card-info-content">{{ data.content || '' }}</view>
            <view class="pa-notice-card-info-date">{{ createdAt }}</view>
        </view>
        <view v-if="!data.isReaded" class="pa-notice-card-new">new</view>
    </view>
</template>

<script>
import { getRandomCover } from '@/utils'
import dayjs from 'dayjs'
import { noticeJump } from '@/utils/business'
import { noticeModel } from '@/api'

export default {
    name: 'NoticeCard',
    props: {
        data: Object
    },
    computed: {
        avatar() {
            return this.data.avatar?.fileUrl || getRandomCover()
        },
        createdAt() {
            return dayjs(this.data.createdAt || '').format('YYYY-MM-DD HH:mm:ss')
        }
    },
    methods: {
        handleDetail() {
            noticeJump(this.data)
            this.handleRead()
        },
        handleRead() {
            this.$message.loading()
            noticeModel.read(this.data.noticeId).then(res => {
                if (res.status === 0) {
                    this.$emit('read', this.data.noticeId)
                }
            }).finally(() => {
                this.$message.hide()
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-notice-card{
    padding: 16rpx;
    border-radius: 16rpx;
    background: #fff;
    margin-bottom: 16rpx;
    box-shadow:  0 0 16rpx 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    position: relative;
    &-avatar{
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
        margin-right: 16rpx;
    }
    &-info{
        flex: 1;
        &-title{
            font-size: 28rpx;
            font-weight: 500;
            color: #FFAA2C;
            line-height: 36rpx;
        }
        &-content{
            font-size: 24rpx;
            font-weight: 400;
            color: #332C22;
            line-height: 34rpx;
        }
        &-date{
            font-size: 20rpx;
            font-weight: 400;
            color: #ccc;
            text-align: right;
        }
    }
    &-new{
        position: absolute;
        right: -6rpx;
        top: -6rpx;
        background: #FFAA2C;
        padding: 4rpx 16rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #fff;
    }
}
</style>
