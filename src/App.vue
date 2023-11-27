<script>
import Vue from 'vue'
import { getTokenInterval } from '@/utils/auth'

export default Vue.extend({
    mpType: 'app',
    async onLaunch() {
        this.$store.commit('SET_HAS_REFRESH_TOKEN', false)
        await this.$store.dispatch('login')
        this.$store.dispatch('setObsInfo')
        this.$store.dispatch('setUserInfo')
        getTokenInterval()
        this.$store.dispatch('checkNewNoticeIntervel')
        this.$store.dispatch('getNoticeAmountInterval')
    },
    onShow() {
        if (!(/Mobi|Android|iPhone/i.test(navigator.userAgent))) {
            window.location.href = 'https://blog.meowmeowmeow.cn/blog-h5'
        }
        setTimeout(() => {
            const params = this.$Router.getRouteQuery()
            if (params && params.gdt_vid) {
                this.$store.commit('SET_CLICK_ID', params.gdt_vid)
            }
        }, 500)
        this.$store.commit('SET_ROUTE_LOCKED', true)
        setTimeout(() => {
            this.$store.commit('SET_ROUTE_LOCKED', false)
        }, 500)
        // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
        // #ifdef MP-WEIXIN
        const updateManager = uni.getUpdateManager()
        updateManager.onUpdateReady(() => {
            uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否马上重启小程序？',
                success: res => {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        // #endif
        // #ifdef H5
        const path = location.pathname.slice(1, location.pathname.length)
        this.$Router.checkRouterAvailable({ path })
        // #endif
    },
    onHide() {
        console.log('App Hide')
        this.$store.commit('REMOVE_CLICK_ID')
    },
})
</script>

<style lang="scss">
@import './styles/index.scss';
@import "@/styles/iconfont/iconfont.css";
</style>
