<template>
    <uni-popup ref="popup" class="pa-dialog">
        <view :style="{ width }" class="pa-dialog-container">
            <view class="pa-dialog-container-main" :style="{ padding: mainPadding }">
                <view v-if="$slots.header || title" class="pa-dialog-header" :class="{ hasNotMessage: !message }">
                    <slot name="header">
                        <span>{{ title }}</span>
                        <uni-icons
                            v-if="showClose"
                            color="#332C22"
                            type="closeempty"
                            size="24"
                            class="pa-dialog-header-close"
                            @click="closeHandle"
                        />
                    </slot>
                </view>
                <view v-if="message" class="pa-dialog-body">
                    <slot>
                        <view>{{ message }}</view>
                    </slot>
                </view>
            </view>
            <view v-if="!hideFooter" class="pa-dialog-footer">
                <slot name="footer">
                    <view class="pa-dialog-footer-inner">
                        <view v-if="!hideCancelBtn" class="pa-dialog-footer-inner-button pa-dialog-cancel" @click="closeHandle">{{ cancelString }}</view>
                        <view v-if="!hideConfirmBtm" class="pa-dialog-footer-inner-button pa-dialog-confirm" :class="{ isDeleteConfirm }" @click="confirmHandle">{{ confirmString }}</view>
                    </view>
                </slot>
            </view>
        </view>
    </uni-popup>
</template>

<script>
export default {
    name: 'PaDialog',
    props: {
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: '650rpx'
        },
        hideCancelBtn: {
            type: Boolean,
            default: false
        },
        hideConfirmBtm: {
            type: Boolean,
            default: false
        },
        cancelString: {
            type: String,
            default: '取消'
        },
        confirmString: {
            type: String,
            default: '确定'
        },
        isDeleteConfirm: Boolean,
        hideFooter: Boolean,
        mainPadding: {
            type: String,
            default: '48rpx 48rpx 32rpx 48rpx'
        },
        showClose: Boolean
    },
    data() {
        return {
            callback: undefined,
            customCancel: undefined
        }
    },
    methods: {
        open(callback, cancel) {
            if (callback) this.callback = callback
            if (cancel) this.customCancel = cancel
            this.$nextTick(() => {
                this.$refs.popup.open()
            })
        },
        closeHandle() {
            if (this.customCancel) this.customCancel()
            this.$refs.popup.close()
        },
        confirmHandle() {
            this.$refs.popup.close()
            this.$emit('confirm')
            setTimeout(() => {
                this.callback()
            }, 300)
        }
    }
}
</script>

<style lang="scss" scoped>
    .pa-dialog{
        display: flex;
        flex-direction: column;
        &-container{
            background: #FFFFFF;
            border-radius: 16rpx;
            min-height: 200rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .pa-dialog-header{
                margin-bottom: 20rpx;
                display: flex;
                justify-content: center;
                font-size: 34rpx;
                font-weight: 600;
                color: #000000;
                line-height: 44rpx;
                display: flex;
                align-items: center;
                position: relative;
                &.hasNotMessage{
                    height: 160rpx;
                }
                &-close{
                    position: absolute;
                    top: 0rpx;
                    right:0rpx;
                }
            }
            .pa-dialog-body{
                flex:1;
                font-size: 34rpx;
                font-weight: 500;
                color: #aaa;
                line-height: 60rpx;
                text-align: center;
                min-height: 128rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        &-footer{
            &-inner{
                display: flex;
                width: 100%;
                border-top: 1rpx solid rgba(0,0,0,0.1);
                height: 104rpx;
                &-button{
                    flex:1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &.pa-dialog-cancel{
                        color:#000000;
                        font-size: 34rpx;
                        font-weight: 500;
                        line-height: 44rpx;
                    }
                    &.pa-dialog-confirm{
                        color:#F28900;
                        font-size: 34rpx;
                        font-weight: 500;
                        line-height: 44rpx;
                        &.isDeleteConfirm{
                            color: #F45731;
                        }
                    }
                }
                &-button+&-button{
                    border-left: 1rpx solid rgba(0,0,0,0.1);
                }
            }
        }
    }
</style>
