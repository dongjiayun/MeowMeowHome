<template>
    <view v-if="visible" class="pa-fixed-cart" :style="{ right,bottom }">
        <uni-badge
            type="error"
            absolute="rightTop"
            :text="cartAmount"
            :offset="[10,10]"
            :custom-style="{
                width: '40rpx',
                height: '40rpx',
                fontSize: '28rpx'
            }"
        >
            <view class="pa-fixed-cart-inner" @click="handleGoToCart">
                <image class="pa-fixed-cart-inner-icon" :src="require('static/tabbar/cart.png')" />
            </view>
        </uni-badge>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'PaFixedCart',
    props: {
        right: {
            type: String,
            default: '24rpx'
        },
        bottom: {
            type: String,
            default: '244rpx'
        }
    },
    computed: {
        ...mapGetters(['cartAmount'])
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = true
        },
        handleGoToCart() {
            this.$Router.push({ name: 'cartInPage' })
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-fixed-cart{
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
    &-inner{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100rpx;
        height: 100rpx;
        &-icon{
            width: 48rpx;
            height: 48rpx;
        }
    }
}
</style>
