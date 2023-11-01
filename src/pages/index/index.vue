<template>
    <pa-container
        is-page
    />
</template>
<script>
// 为了规避小程序单包2m限制  所以首页直接重定向到分包home
export default {
    onShow() {
        this.$message.loading()
        setTimeout(() => {
            this.$message.hide()
            this.$Router.redirectTo({
                name: 'home'
            })
        }, 500)
    }
}
</script>
