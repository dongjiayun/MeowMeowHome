<template>
    <view class="pa-search-empty" :style="{ minHeight: height }">
        <view class="pa-search-empty-icon">
            <image :style="{ height: imageHeight, width: imageWidth }" :src="image || require('@/static/base/empty.png')" />
            <text
                class="empty-text"
                :style="{ marginTop: textMargin }"
            >{{ label }}</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'PaEmpty',
    props: {
        label: {
            type: String,
        },
        image: String,
        height: String,
        textMargin: String,
        imageHeight: {
            type: String,
            default: '200rpx'
        },
        imageWidth: {
            type: String,
            default: '320rpx'
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-search-empty{
    min-height: 600rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &-icon{
        display: flex;
        flex-direction: column;
        align-items: center;
        .empty-text{
            text-align: center;
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.5);
            line-height: 48rpx;
        }
    }
}
</style>
