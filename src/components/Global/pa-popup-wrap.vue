<template>
    <view
        class="pa-popup-wrap"
        :style="{
            paddingBottom: statusBarHeight + 'px',
            top: statusBarHeight + 'px',
            background
        }"
    >
        <view
            class="pa-popup-wrap-close-wrap"
            :style="{
                top: -statusBarHeight + 'px',
                height: statusBarHeight + 'px'
            }"
            @click="cancelHandle"
        />
        <view v-if="custom" class="pa-popup-wrap-custom-content">
            <slot />
        </view>
        <view v-else>
            <view
                v-if="hideHeader"
                class="pa-popup-wrap-simple-header"
                @click="cancelHandle"
            >
                <uni-icons color="#332C22" type="closeempty" size="24" />
            </view>
            <view v-if="!hideHeader" class="pa-popup-wrap-header" :style="{ border: hideHeaderBorder ? 'none' : undefined }">
                {{ title }}
            </view>
            <view class="pa-popup-wrap-body" :style="{ padding: noPadding ? '0 0 40rpx 0' : '24rpx 24rpx 64rpx 24rpx' }">
                <slot />
            </view>
            <view v-if="!hideHeader" class="pa-popup-wrap-footer">
                <button style="min-width: 240rpx;margin-right: 30rpx" class="pa-mall-button-plain" @click="cancelHandle">{{ cancelText }}</button>
                <button :disabled="disableSubmit" style="min-width: 240rpx" class="pa-mall-button" @click="confirmHandle">{{ confirmText }}</button>
            </view>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'PaPopupWrap',
    props: {
        title: {
            type: String,
            default: '',
        },
        hideHeader: Boolean,
        custom: Boolean,
        background: String,
        noPadding: Boolean,
        hideHeaderBorder: Boolean,
        confirmText: {
            type: String,
            default: '确认'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        disableSubmit: Boolean
    },
    computed: {
        ...mapGetters(['statusBarHeight'])
    },
    methods: {
        cancelHandle() {
            this.$emit('cancel')
        },
        confirmHandle() {
            this.$emit('submit')
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-popup-wrap{
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    position: relative;
    //overflow: hidden;
    &-close-wrap{
        position: absolute;
        width: 100vw;
    }
    &-custom-content{
        border-radius: 24rpx 24rpx 0 0;
        overflow: auto;
    }
    &-simple-header{
        position: absolute;
        top:24rpx;
        right: 24rpx;
        z-index: 99;
    }
    &-header{
        height: 128rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        font-weight: 500;
        color: #332C22;
        border-bottom: 1rpx solid #EEEEEE;
    }
    &-body{
        max-height: 80vh;
        overflow: auto;
    }
    &-footer{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 40rpx;
    }
}
</style>
