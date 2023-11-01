<template>
    <text class="pa-text-button" :style="{ color }" @click="click">
        <slot />
    </text>
</template>

<script>
export default {
    name: 'PaTextButton',
    props: {
        color: {
            type: String,
            default: '#FF824C'
        }
    },
    methods: {
        click() {
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
    .pa-text-button{
        cursor: pointer;
        font-size: 28rpx;
        line-height: 44rpx;
        font-weight: 400;
    }
    .pa-text-button+.pa-text-button{
        margin-left: 16rpx;
    }
</style>
