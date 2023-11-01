<template>
    <pa-container
        background="#000"
        :style="{ height: height + 'px' }"
    >
        <view class="pa-video-preview">
            <view class="pa-video-preview-header">
                <pa-navbar light />
            </view>
            <video autoplay style="width: 100%" :style="{ height: (height - 180) + 'px' }" loop :src="src" />
        </view>
    </pa-container>
</template>
<script>
export default {
    data() {
        return {
            src: '',
            height: 0,
        }
    },
    onLoad({ src }) {
        this.src = decodeURIComponent(src)
        this.height = uni.getSystemInfoSync().windowHeight
    }
}
</script>
<style lang="scss" scoped>
.pa-video-preview{
    background: #000;
    min-height: 100vh;
    &-header{
        z-index: 10;
        background: #000;
        position: sticky;
        top: 0;
    }
}
</style>
