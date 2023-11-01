<template>
    <view class="pa-price" :style="{ color }">
        <text :style="{ fontSize: subFontSize + 'rpx',color }">¥</text>
        <text
            class="pa-price-int"
            :style="{ fontSize: fontSize + 'rpx' ,color }"
        >{{ toThousandsNumByPenny(price || 0,0) }}</text>
        <text class="pa-price-int" :style="{ fontSize: subFontSize + 'rpx',color }">.{{ getDecimals(price || 0) }}</text>
    </view>
</template>

<script>
import { getDecimals, toThousandsNumByPenny } from '@/utils'

export default {
    name: 'PaPrice',
    props: {
        price: Number,
        fontSize: {
            type: Number,
            default: 40
        },
        subFontSize: {
            type: Number,
            default: 24
        },
        color: {
            type: String,
            default: '#F45731'
        }
    },
    methods: {
        getDecimals,
        toThousandsNumByPenny
    }
}
</script>

<style lang="scss" scoped>
.pa-price{
    font-size: 24rpx;
    font-weight: bold;
    line-height: 28rpx;
    -webkit-text-stroke: 0px #FFFFFF;
    text-stroke: 0px #FFFFFF;
    display: flex;
    align-items: baseline;
    font-family: ffDin;
    &-int{
        font-size: 40rpx;
    }
}
</style>
