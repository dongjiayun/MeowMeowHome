<template>
    <view class="pa-user-card" @click="handleGotoDetail">
        <image mode="aspectFill" class="pa-user-card-avatar" :src="avatar" />
        <view class="pa-user-card-name">{{ data.username || '匿名猫猫' }}</view>
        <view class="pa-user-card-info">
            <view class="pa-user-card-info-item">
                <text class="pa-user-card-info-item-num">{{ follows }}</text> 关注
            </view>
            <view class="pa-user-card-info-item">
                <text class="pa-user-card-info-item-num">{{ followers }}</text> 粉丝
            </view>
        </view>
    </view>
</template>

<script>
import { getRandomCover, toThousandsNum } from '@/utils'
export default {
    name: 'UserCard',
    props: {
        data: Object
    },
    computed: {
        avatar() {
            return this.data.avatar?.fileUrl || getRandomCover()
        },
        follows() {
            return toThousandsNum(this.data.followIds?.length || 0, 0)
        },
        followers() {
            return toThousandsNum(this.data.followerIds?.length || 0, 0)
        }
    },
    methods: {
        handleGotoDetail() {
            this.$Router.push({
                name: 'user',
                query: {
                    cid: this.data.cid
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-user-card{
    display: flex;
    align-items: center;
    padding:16rpx;
    border-radius: 16rpx;
    background: #fff;
    margin-bottom: 16rpx;
    box-shadow:  0 0 16rpx 0 rgba(0, 0, 0, 0.1);
    &-avatar{
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
        margin-right: 16rpx;
    }
    &-name{
        font-size: 28rpx;
        font-weight: 500;
        color: #332C22;
        line-height: 36rpx;
        flex: 1;
    }
    &-info{
        display: flex;
        align-items: center;
        &-item{
            font-size: 24rpx;
            font-weight: 400;
            color: #332C22;
            line-height: 32rpx;
            &-num{
                color: #FFAA2C;
                margin-right: 12rpx;
            }
        }
        &-item+&-item{
            margin-left: 16rpx;
        }
    }
}
</style>
