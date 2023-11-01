<template>
    <view class="pa-checkbox" @click="handleClick">
        <image
            class="pa-checkbox-icon"
            :style="{
                height: size + 'rpx',
                width: size + 'rpx'
            }"
            :src="disabled ? require('static/global/radio_disabled.png') : value ? require('static/global/radio_active.png') : require('static/global/radio_inactive.png')"
        />
    </view>
</template>

<script>
export default {
    name: 'PaCheckbox',
    props: {
        value: Boolean,
        disabled: Boolean,
        size: {
            type: Number,
            default: 40
        }
    },
    methods: {
        handleClick() {
            if (this.disabled) return
            this.$emit('input', !this.value)
            this.$emit('update:value', !this.value)
            this.$emit('change', !this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-checkbox{
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 100%;
}
</style>
