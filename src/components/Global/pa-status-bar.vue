<template>
    <view class="status_bar" :style="{ height: iStatusBarHeight + 'px' }" />
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'PaStatusBar',
    data() {
        return {
            iStatusBarHeight: 0
        }
    },
    computed: {
        ...mapGetters(['statusBarHeight'])
    },
    created() {
        if (this.statusBarHeight) {
            this.iStatusBarHeight = this.statusBarHeight
        } else {
            const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
            this.iStatusBarHeight = statusBarHeight
            this.$store.dispatch('setStatusBarHeight', statusBarHeight)
        }
    }
}
</script>

<style scoped>

</style>
