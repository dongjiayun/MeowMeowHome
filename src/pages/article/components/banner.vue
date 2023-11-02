<template>
    <view class="pa-article-detail-banner">
        <swiper
            class="pa-article-detail-banner-swiper"
            :style="{ height: windowWidth }"
            @change="handleSwiper"
        >
            <swiper-item
                v-for="(item,index) in data"
                :key="index"
                class="pa-article-detail-banner-swiper-item"
            >
                <image
                    class="pa-article-detail-banner-swiper-item-image"
                    :style="{ height: windowWidth }"
                    mode="aspectFill"
                    :src="item"
                    @click="handlePreview(index)"
                />
            </swiper-item>
        </swiper>
        <view v-if="data.length > 0" class="pa-article-detail-banner-page">
            {{ current }}/{{ data.length }}
        </view>
    </view>
</template>

<script>
export default {
    name: 'Banner',
    props: {
        data: Array
    },
    data() {
        return {
            current: 1,
        }
    },
    computed: {
        windowWidth() {
            return uni.getSystemInfoSync().windowWidth + 'px'
        }
    },
    methods: {
        handleSwiper({ detail: { current }}) {
            this.current = current + 1
        },
        handlePreview(index) {
            uni.previewImage({
                current: index,
                urls: this.data
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.pa-article-detail-banner{
    position: relative;
    margin-bottom: 16rpx;
    z-index: 0;
    &-swiper{
        height: 650rpx;
        &-item{
            display: flex;
            align-items: center;
            &-image{
                width: 100%;
                height: 650rpx;
            }
        }
        background: url("~static/base/pic_placeholder.png") no-repeat center/cover;
    }
    &-page{
        position: absolute;
        bottom: 16rpx;
        right: 16rpx;
        padding:10rpx 20rpx;
        background: #000000;
        border-radius: 30rpx;
        opacity: 0.3;
        font-size: 24rpx;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 30rpx;
    }
}
</style>
