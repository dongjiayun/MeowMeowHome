<template>
    <view class="pa-alert" :class="type">
        {{ content }}
    </view>
</template>

<script>
export default {
    name: 'PaAlert',
    props: {
        content: String,
        type: {
            type: String,
            default: 'error'
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-alert{
    &.error{
        background: #FFE8E6;
        color: #F45731;
    }
    &.warning{
        background: #FFEACC;
        color:#F28900;
    }
    height: 60rpx;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
