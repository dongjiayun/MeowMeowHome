<template>
    <view class="pa-search-item">
        <slot>
            <view v-if="data">
                <view class="title">{{ data.title }}</view>
                <view v-if="data.subtitle" class="subtitle">{{ data.subtitle }}</view>
            </view>
        </slot>
    </view>
</template>

<script>
export default {
    name: 'SearchItem',
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>

<style lang="scss">
    .pa-search-item{
        background: #fff;
        padding:30rpx 0;
        .title{
            font-size: 32rpx;
            font-weight: 400;
            color: #000000;
            line-height: 32rpx;
        }
        .subtitle{
            margin-top: 18rpx;
            font-size: 26rpx;
            font-weight: 400;
            color: #999999;
            line-height: 26rpx;
        }
    }
    .pa-search-item+.pa-search-item{
        border-top: 1rpx solid #EEEEEE;
    }
</style>
