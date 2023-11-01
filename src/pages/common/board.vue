<template>
    <pa-container class="pa-board">
        <rich-text :nodes="content" />
    </pa-container>
</template>

<script>

export default {
    name: 'Board',
    onShow() {
        this.content = this.$storage.get('pa-black-board-content')
    },
    data() {
        return {
            content: ''
        }
    },
    onHide() {
        this.$storage.remove('pa-black-board-content')
    }
}
</script>

<style lang="scss">
.pa-board{
    padding:60rpx
}
</style>
