<template>
    <pa-container
        ref="container"
        is-page
        background="#F5F5F5"
        use-origin-cover
    >
        <view class="pa-home-page">
            <pa-status-bar />
            <view class="pa-home-page-body">
                <pa-water-fall :data="list">
                    <template #default="{ item }">
                        <article-card
                            :data="item"
                            class="pa-home-page-body-item"
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
import articleCard from '@/components/business/articleCard.vue'
import pagination from '@/mixin/pagination'
import { articleModel } from '@/api'
import { uniqBy } from 'lodash'

export default {
    name: 'Index',
    components: {
        articleCard
    },
    computed: {
        ...mapGetters(['token']),
    },
    mixins: [pagination],
    onPullDownRefresh() {
        this.init()
    },
    onReachBottom() {
        if (!this.noMore) {
            this.getData()
        }
    },
    data() {
        return {
            list: []
        }
    },
    mounted() {
        this.init()
    },
    onPageScroll({ scrollTop }) {
    },
    methods: {
        async init() {
            this.initPagination()
            this.list = []
            this.getData()
        },
        getData() {
            const params = {
                pageNo: this.pageNo,
                pageIndex: this.pageNo,
            }
            this.$message.loading()
            articleModel.list(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.list = uniqBy([... this.list, ... res.data.list], 'articleId')
                        this.pageNo++
                    } else {
                        this.noMore = true
                    }
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
                uni.stopPullDownRefresh()
            })
        }
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
    &-body{
        padding: 16rpx;
        &-item{
            margin-bottom: 16rpx;
        }
    }
}
</style>
