<template>
    <view
        v-if="show"
        class="pa-back-top"
        :style="{ bottom }"
        @click="handleBackTop"
    >
        <image class="pa-back-top-icon" :src="require('static/global/backtop.png')" />
    </view>
</template>

<script>
export default {
    name: 'PaBackTop',
    props: {
        show: Boolean,
        bottom: {
            type: String,
            default: '244rpx'
        }
    },
    methods: {
        handleBackTop() {
            uni.pageScrollTo({
                scrollTop: 0
            })
            this.$emit('backTop')
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-back-top{
    position: fixed;
    right: 24rpx;
    bottom:244rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88rpx;
    height: 88rpx;
    background: rgba(255,255,255,0.9);
    box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(0,0,0,0.05);
    border: 1rpx solid #E6E6E6;
    border-radius: 88rpx;
    transition: all .3s;
    &-icon{
        width: 48rpx;
        height: 48rpx;
    }
}
</style>
