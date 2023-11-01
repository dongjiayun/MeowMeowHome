<template>
    <view v-if="showMask" class="pa-loading-mask">
        <view v-if="showLoading" class="pa-loading-mask-container">
            <view class="pa-container-loading">
                <pa-loading />
            </view>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'LoadingMask',
    computed: {
        ...mapGetters(['showMask', 'showLoading'])
    }
}
</script>

<style lang="scss">
    .pa-loading-mask{
        top:60rpx;
        position: fixed;
        z-index: 9999;
        width: 100%;
        height: calc(100vh - 60rpx);
        display: flex;
        justify-content: center;
        align-items: center;
        &-container{
            width: 200rpx;
            height: 200rpx;
            background: #fedaa2;
            border-radius: 200rpx;
        }
    }
</style>
