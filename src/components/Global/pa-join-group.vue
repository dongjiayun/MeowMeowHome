<template>
    <pa-popup
        ref="popup"
        hide-header
    >
        <view class="pa-join-group">
            <slot name="title">
                <view class="pa-join-group-info">
                    长按识别下方二维码
                </view>
                <view class="pa-join-group-info">
                    <text>添加</text>
                    <text class="pa-join-group-info-orange">{{ groupName }}</text>
                    <!--                    <text>即刻入群</text>-->
                </view>
            </slot>
            <view class="pa-join-group-body">
                <image
                    mode="aspectFill"
                    class="pa-join-group-body-qrcode"
                    show-menu-by-longpress
                    :src="qrcode"
                />
                <view class="pa-join-group-body-corner left" />
                <view class="pa-join-group-body-corner right" />
            </view>
        </view>
    </pa-popup>
</template>

<script>
export default {
    name: 'PaJoinGroup',
    props: {
        qrcode: String,
        groupName: String
    },
    methods: {
        open() {
            this.$refs.popup.open()
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-join-group{
    margin-top: 80rpx;
    &-info{
        font-size: 30rpx;
        font-weight: 500;
        color: #332C22;
        line-height: 42rpx;
        text-align: center;
        &-orange{
            color:#F28900
        }
    }
    &-body{
        padding:40rpx 0 100rpx 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        &-corner{
            position: absolute;
            width: 32rpx;
            height: 32rpx;
            &.left{
                top:30rpx;
                left: 146rpx;
                border-top:1px solid #332C22;
                border-left:1px solid #332C22;
            }
            &.right{
                bottom:96rpx;
                right: 146rpx;
                border-right:1px solid #332C22;
                border-bottom:1px solid #332C22;
            }
        }
        &-qrcode{
            width: 400rpx;
            height: 400rpx;
        }
    }
}
</style>
