<template>
    <pa-popup
        ref="popup"
        :title="title"
        hide-header-border
        no-padding
        :disable-submit="isDisabled()"
        :confirm-text="confirmText"
        :cancel-text="cancelText"
        @submit="handleSubmit"
    >
        <view class="pa-popup-chooser">
            <view
                v-for="(item,index) in opts"
                :key="index"
                class="pa-popup-chooser-item"
                @click="handleClick(item)"
            >
                <view class="pa-popup-chooser-item-label">{{ item.label }}</view>
                <pa-checkbox :value="isCheck(item)" :size="48" />
            </view>
        </view>
    </pa-popup>
</template>

<script>
import { isNullOrEmpty } from '@/utils'
export default {
    name: 'PaPopupChooser',
    props: {
        title: String,
        confirmText: {
            type: String,
            default: '确认'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        opts: Array
    },
    data() {
        return {
            value: undefined,
            item: undefined
        }
    },
    methods: {
        open(data) {
            if (!isNullOrEmpty(data)) {
                this.value = data
                this.item = this.opts.find(i => i.value === data)
            } else {
                this.value = undefined
                this.item = undefined
            }
            this.$refs.popup.open()
        },
        handleSubmit() {
            this.$emit('submit', this.value, this.item)
        },
        handleClick(item) {
            this.item = item
            this.value = item.value
        },
        isCheck(item) {
            return this.value === item.value
        },
        isDisabled() {
            return isNullOrEmpty(this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-popup-chooser{
    padding:0 48rpx;
    &-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;
        font-weight: 400;
        color: #332C22;
        line-height: 42rpxpx;
        height: 112rpx;
        border-bottom: 1rpx solid #EEEEEE;
    }
}
</style>
