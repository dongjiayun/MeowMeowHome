<template>
    <view class="avatar" :style="{ height: size + 'rpx',width: size + 'rpx' }">
        <image mode="aspectFill" :src="url || require('static/base/default-meow.svg')" style="height: 100%;width: 100%" />
    </view>
</template>

<script>
export default {
    name: 'Avatar',
    props: {
        url: String,
        size: {
            type: [Number, String],
            default: 200
        }
    }
}
</script>

<style lang="scss" scoped>
    .avatar{
        border-radius: 500rpx;
        overflow: hidden;
    }
</style>
