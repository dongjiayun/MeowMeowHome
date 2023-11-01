<template>
    <uni-popup ref="popup" class="pa-login-popup" type="bottom" background-color="#fff">
        <view class="pa-login-popup-wrap">
            <view class="pa-login-popup-title">
                <image class="logo" />
                <view>盟宠星球 申请</view>
            </view>
            <view class="pa-login-popup-subtitle">
                获取你的昵称、头像
            </view>
            <view class="pa-login-popup-avatar">
                <image class="avatar" />
                <view class="content">
                    <view class="name" />
                    <view class="subtitle">微信昵称头像</view>
                </view>
                <uni-icons type="checkmarkempty" size="30" />
            </view>
            <view class="pa-login-popup-buttons">
                <button>拒绝</button>
                <button>允许</button>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    name: 'LoginPopup',
    methods: {
        submitHandle() {
            this.$emit('submit')
            this.$refs.popup.close()
        },
        open() {
            this.$refs.popup.open()
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-login-popup{
    &-wrap{
        .pa-login-popup-title{

        }
        .pa-login-popup-subtitle{

        }
    }
}
</style>
