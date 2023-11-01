<template>
    <uni-popup
        ref="popup"
        class="pingan-popup"
        type="bottom"
        @change="changeHandle"
        @maskClick="closeHandle"
    >
        <pa-popup-wrap
            :hide-header="hideHeader"
            :title="title"
            :custom="custom"
            :background="background"
            :no-padding="noPadding"
            :hide-header-border="hideHeaderBorder"
            :confirm-text="confirmText"
            :cancel-text="cancelText"
            @cancel="closeHandle"
            @submit="submitHandle"
        >
            <slot />
        </pa-popup-wrap>
    </uni-popup>
</template>

<script>
export default {
    name: 'PaPickerPopup',
    props: {
        title: {
            type: String,
            default: ''
        },
        hideHeaderBorder: Boolean,
        hideHeader: Boolean,
        custom: Boolean,
        background: {
            type: String,
            default: '#fff'
        },
        noPadding: Boolean,
        confirmText: {
            type: String,
            default: '确认'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        customCancel: Boolean,
        disableSubmit: Boolean,
    },
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        changeHandle({ show }) {
            uni.$emit('popup-change', show)
        },
        submitHandle() {
            if (this.disableSubmit) {
                return this.$toast({ title: '请' + this.title })
            }
            this.$store.commit('ENABLE_PAGE_SCROLL')
            this.$store.commit('HIDE_POPUP_MASK')
            this.$emit('submit')
            this.$refs.popup.close()
        },
        open() {
            this.$store.commit('DISABLE_PAGE_SCROLL')
            this.$store.commit('SHOW_POPUP_MASK')
            this.$refs.popup.open()
            this.$emit('open')
            this.isOpen = true
        },
        close() {
            this.$store.commit('HIDE_POPUP_MASK')
            this.$store.commit('ENABLE_PAGE_SCROLL')
            if (this.customCancel) {
                this.$emit('close')
            } else {
                this.$emit('close')
                this.$refs.popup.close()
            }
            this.isOpen = false
        },
        closeHandle() {
            this.$store.commit('ENABLE_PAGE_SCROLL')
            this.$store.commit('HIDE_POPUP_MASK')
            this.$refs.popup.close()
            this.$emit('close')
        },
        trigger() {
            if (this.isOpen) {
                this.close()
            } else {
                this.open()
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
@import "@/styles/variable";
.uni-modal{
    background: rgba(205, 205, 205)!important;
    border-radius: 28rpx!important;
    .uni-modal__hd{
        padding-top: 40rpx ;
    }
    .uni-modal__bd{
        font-size: 26rpx;
        font-weight: 400;
        line-height: 32rpx;
        margin: 4rpx auto;
        padding: 0 40rpx;
        font-weight: 400;
        color: #000000;
    }
    .uni-modal__ft{
        .uni-modal__btn_default{
            font-size: 36rpx;
            font-weight: 400;
            color:$pingan-color!important;
        }
        .uni-modal__btn_primary{
            font-weight: bolder;
            color:$pingan-color!important;
            &:after{
                border-left: solid 1px rgba(60, 60, 67, 0.36);
            }
        }
        &:after{
            border-bottom: solid 1px rgba(60, 60, 67, 0.36);
        }
    }
}
</style>
