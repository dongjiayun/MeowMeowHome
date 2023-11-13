<template>
    <view class="pa-logo" :class="{ doubleBottomPadding }">
        <!--        <view v-if="hideLogo" class="pa-logo-image" />-->
        <view v-if="!hideLogo" :style="{ color }" class="pa-logo-slogan">Meow 喵喵喵 Meow</view>
    </view>
</template>

<script>
export default {
    name: 'PaLogo',
    props: {
        doubleBottomPadding: Boolean,
        hideLogo: Boolean,
        color: {
            type: String,
            default: '#ddd'
        }
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
    &-slogan{
        font-size: 44rpx;
        font-weight: bolder;
        color:#ddd;
    }
}
</style>
