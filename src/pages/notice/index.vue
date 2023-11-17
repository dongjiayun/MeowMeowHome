<template>
    <pa-container
        disable-share
        is-page
    >
        <view class="pa-notice">
            <view class="pa-notice-header">
                <pa-navbar>我的消息</pa-navbar>
            </view>
            <view class="pa-notice-body">
                <pa-empty v-if="list.length === 0" />
                <notice-card
                    v-for="(item,index) in list"
                    :key="index"
                    :data="item"
                    @read="handleRead"
                />
                <pa-logo double-bottom-padding />
            </view>
            <pa-footer is-top-index>
                <button class="pa-mall-button" @click="handleReadAll">全部已读</button>
            </pa-footer>
        </view>
    </pa-container>
</template>

<script>
import pagination from '@/mixin/pagination'
import { noticeModel } from '@/api'
import { uniqBy } from 'lodash'
import noticeCard from '@/components/business/noticeCard.vue'
import PaLogo from '@/components/Global/pa-logo.vue'

export default {
    components: {
        PaLogo,
        noticeCard
    },
    mixins: [pagination],
    data() {
        return {
            list: [],
        }
    },
    mounted() {
        this.init()
    },
    onReachBottom() {
        this.getData()
    },
    onPullDownRefresh() {
        this.init()
    },
    onShow() {
        uni.$on('showNotice', this.init)
    },
    onHide() {
        uni.$off('showNotice')
    },
    methods: {
        init() {
            this.list = []
            this.initPagination()
            this.getData()
        },
        getData() {
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            }
            noticeModel.list(params).then((res) => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.list = uniqBy([... this.list, ... res.data.list], 'noticeId')
                        this.pageNo++
                    } else {
                        this.noMore = true
                    }
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                uni.stopPullDownRefresh()
            })
        },
        handleRead(noticeId) {
            const index = this.list.findIndex(item => item.noticeId === noticeId)
            this.$set(this.list[index], 'isReaded', true)
        },
        handleReadAll() {
            this.$message.loading()
            noticeModel.readAll().then((res) => {
                if (res.status === 0) {
                    this.$toast({ title: '已全部已读' })
                    this.init()
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-notice{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
        background: #fff;
    }
    &-body{
        padding: 16rpx;
    }
}
</style>
