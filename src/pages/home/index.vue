<template>
    <pa-container
        ref="container"
        is-page
        background="#F5F5F5"
        scroll-x-hidden
        use-origin-cover
    >
        <view class="pa-home-page">
            <pa-status-bar />
            <view class="pa-home-page-body">
                <pa-water-fall :data="list">
                    <template #default="{ item }">
                        <goods-card
                            :data="item"
                            class="pa-home-recommend-main-item"
                        />
                    </template>
                </pa-water-fall>
            </view>
            <pa-logo
                double-bottom-padding
            />
        </view>
    </pa-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Index',
    components: {
    },
    computed: {
        ...mapGetters(['token']),
    },
    onPullDownRefresh() {
        this.init()
    },
    data() {
        return {
        }
    },
    mounted() {
        this.init()
    },
    onPageScroll({ scrollTop }) {
    },
    methods: {
        async init() {
        },
    }
}
</script>

<style scoped lang="scss">
.pa-home-page{
    background: #F5F5F5;
    &-header{
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        &-logo{
            width: 166rpx;
            height: 64rpx
        }
    }
    &-main{
        margin: 0 16rpx;
        &-item{
            margin-bottom: 16rpx;
        }
    }
}
</style>
