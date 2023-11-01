<template>
    <view class="pa-footer" :class="{ isTopIndex }">
        <slot />
    </view>
</template>

<script>
export default {
    name: 'PaFooter',
    props: {
        isTopIndex: Boolean
    }
}
</script>

<style lang="scss" scoped>
.pa-footer{
    position: fixed;
    bottom: 0;
    height: calc(140rpx + env(safe-area-inset-bottom));
    padding:24rpx;
    width: 100vw;
    background: #FFFFFF;
    box-shadow: 0px -16rpx 32rpx 0px rgba(51,51,51,0.06);
    z-index: 10;
    &.isTopIndex{
        z-index: 999999;
    }
}
</style>
