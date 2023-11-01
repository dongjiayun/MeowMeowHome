<template>
    <view class="pa-logo" :class="{ doubleBottomPadding }">
        <view v-if="hideLogo" class="pa-logo-image" />
        <image v-else class="pa-logo-image" :src="require('static/base/logo.png')" />
    </view>
</template>

<script>
export default {
    name: 'PaLogo',
    props: {
        doubleBottomPadding: Boolean,
        hideLogo: Boolean
    }
}
</script>

<style lang="scss" scoped>
.pa-logo{
    padding: 28rpx 0 160rpx;
    display: flex;
    justify-content: center;
    &.doubleBottomPadding{
        padding: 48rpx 0 260rpx;
    }
    &-image{
        width: 180rpx;
        height: 40rpx;
    }
}
</style>
