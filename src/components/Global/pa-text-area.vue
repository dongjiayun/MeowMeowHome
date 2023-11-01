<template>
    <view class="pa-text-area">
        <view class="pa-text-area-content">
            <custom-easyinput
                :value="value"
                type="textarea"
                :input-border="false"
                :placeholder="placeholder"
                placeholder-style="fontSize: 28rpx;fontWeight: 400;color: #ADADAD "
                :maxlength="max"
                background-color="#F5F5F5"
                @input="handleChange"
                @focus="handleFocus"
                @blur="handleBlur"
            />
            <uni-icons
                v-if="value && focus"
                class="pa-text-area-content-clear"
                color="#c0c4cc"
                type="clear"
                size="26"
                @click="handleClear"
            />
        </view>
        <view v-if="value" class="pa-text-area-limit">
            {{ value.length > max ? max : value.length }}/{{ max }}
        </view>
    </view>
</template>

<script>
import customEasyinput from '../custom-easyinput'
export default {
    name: 'PaTextArea',
    components: { customEasyinput },
    props: {
        placeholder: String,
        value: String,
        max: {
            type: Number,
            default: 200
        },
    },
    data() {
        return {
            focus: false
        }
    },
    methods: {
        handleChange(e) {
            this.$emit('input', e)
            this.$emit('change', e)
        },
        handleClear() {
            this.$emit('input', '')
        },
        handleFocus() {
            this.focus = true
        },
        handleBlur() {
            this.focus = false
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-text-area{
    background: #F5F5F5 !important;
    border-radius: 8rpx;
    padding:24rpx;
    overflow:hidden;
    &-content{
        display:flex;
        align-items:center;
        ::v-deep .uni-easyinput__content .is-textarea{
            padding:0;
            .uni-easyinput__content-textarea{
                margin: 0;
            }
        }
    }
    &-limit{
        display: flex;
        justify-content: flex-end;
        font-size: 24rpx;
        font-weight: 400;
        color: #ADADAD;
        line-height: 32rpx;
    }
}
</style>
