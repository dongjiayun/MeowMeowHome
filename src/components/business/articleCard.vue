<template>
    <view
        v-if="data"
        class="pa-goods-card"
        :class="{ stableSizeSmall }"
        @click="handleClick"
    >
        <uni-transition :duration="random(300,800)" :show="true" mode-class="fade">
            <image
                class="pa-goods-card-image"
                :class="{ stableSize,stableSizeSmall }"
                :src="getThumb(data.cover,60)"
                mode="widthFix"
            />
            <view class="pa-goods-card-info">
                <view class="pa-goods-card-info-title">{{ data.productName }}</view>
            </view>
        </uni-transition>
    </view>
</template>

<script>
import { getThumb } from '@/utils/obs'
import { random } from 'lodash'

export default {
    name: 'GoodsCard',
    props: {
        data: Object,
    },
    methods: {
        getThumb,
        random,
        handleClick() {
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-goods-card{
    border-radius: 16rpx;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    width: 352rpx;
    &.stableSizeSmall{
        width: 230rpx;
    }
    &-image{
        width: 352rpx;
        &.stableSize{
            width: 336rpx;
        }
        &.stableSizeSmall{
            width: 230rpx;
        }
    }
    &-info{
        padding:8rpx 16rpx 16rpx;
        background: #FFFFFF;
        &-title{
            font-size: 28rpx;
            font-weight: 400;
            color: #332C22;
            line-height: 36rpx;
            margin-bottom: 8rpx;
        }
        &-subtitle{
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.3);
            line-height: 32rpx;
            margin-bottom: 20rpx;
        }
    }
}
</style>
