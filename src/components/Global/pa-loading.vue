<template>
    <view
        class="pa-loading"
        :style="{
            background: `url(https://res.ipetapi.com/miniprogram/mall/loading.png) no-repeat  ${left}rpx ${top}rpx/  ${backgroundImageWidth}rpx auto `,
            width: size + 'rpx',
            height: size + 'rpx'
        }"
    />
    <!--    <view class="pa-loading" />-->
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
            interval: undefined,
            currentFrame: 1
        }
    },
    computed: {
        top() {
            return -Math.floor(this.currentFrame / 6) * this.size
        },
        left() {
            return -Math.floor(this.currentFrame % 6) * this.size
        },
        backgroundImageWidth() {
            return 864 / (144 / this.size)
        }
    },
    mounted() {
        this.interval = setInterval(() => {
            if (this.currentFrame < 36) {
                this.currentFrame++
            } else {
                this.currentFrame = 1
            }
        }, 60)
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>

<style lang="scss">
    .pa-loading {
        width: 200rpx;
        height: 200rpx;
        &.isPage{
            position: relative;
        }
    }
</style>
