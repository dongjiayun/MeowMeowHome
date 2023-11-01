<template>
    <pa-container class="pa-webview">
        <web-view allow="AllowAll" :src="url" :progress="true" />
    </pa-container>
</template>

<script>

export default {
    data() {
        return {
            url: '',
            title: ''
        }
    },
    onLoad(op) {
        this.url = decodeURIComponent(op.url)
        if (op.title) {
            this.title = decodeURIComponent(op.title)
        }
    },
    onReady() { // 改变标题
        uni.setNavigationBarTitle({
            title: this.title
        })
    }
}
</script>
<style lang="scss">
    .pa-webview{
        width: 100%;
        min-height: 100vh;
    }
</style>
