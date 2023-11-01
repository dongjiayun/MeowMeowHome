<template>
    <view class="pa-text-coupon" :style="{ background }">
        <text class="pa-text-coupon-content">{{ text }}</text>
        <view class="pa-text-coupon-content-left" :style="{ background }" />
        <view class="pa-text-coupon-content-right" :style="{ background }" />
    </view>
</template>

<script>
export default {
    name: 'PaTextCoupon',
    props: {
        text: String,
        background: {
            type: String,
            default: '#fff'
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-text-coupon{
    padding:2rpx 16rpx;
    box-shadow: 0px -16rpx 32rpx 0rrpx rgba(51,51,51,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #F45731;
    position: relative;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    &-content{
        font-size: 20rpx;
        font-weight: 500;
        color: #F45731;
        line-height: 28rpx;
        text-shadow: 0px -16rpx 32rpx rgba(51,51,51,0.06);
    }
    @mixin semicircle {
        height: 12rpx;
        width: 10rpx;
        border-width: 1px;
        border-style: solid;
        border-color: #F45731;
        border-top-right-radius: 10rpx;
        border-bottom-right-radius: 10rpx;
        border-left: none;
    }
    .pa-text-coupon-content-left{
        @include semicircle;
        position: absolute;
        left: -2rpx;
    }
    .pa-text-coupon-content-right{
        @include semicircle;
        position: absolute;
        right: -2rpx;
        transform: rotate(180deg);
    }
}
</style>
