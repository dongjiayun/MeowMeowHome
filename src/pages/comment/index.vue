<template>
    <pa-container
        is-page
        disable-share
    >
        <view class="pa-comment">
            <view class="pa-comment-header">
                <pa-navbar>评论</pa-navbar>
            </view>
            <view class="pa-comment-body">
                <comment-card
                    v-for="(item,index) in list"
                    :key="index"
                    :data="item"
                />
                <pa-empty v-if="list.length === 0" />
                <pa-logo double-bottom-padding />
            </view>
            <pa-footer>
                <custom-search-bar
                    v-model="comment"
                    cancel-text="发送"
                    placeholder="说话,说话!"
                    radius="100"
                    @cancel="handleCreate"
                    @confirm="handleCreate"
                >
                    <template #searchIcon />
                </custom-search-bar>
            </pa-footer>
        </view>
    </pa-container>
</template>

<script>
import customSearchBar from '@/components/custom-search-bar/index.vue'
import commentCard from '@/components/business/commentCard.vue'
import { commentModel } from '@/api'
import pagination from '@/mixin/pagination'
import { uniqBy } from 'lodash'

export default {
    name: 'Comment',
    components: {
        customSearchBar,
        commentCard
    },
    mixins: [pagination],
    onLoad({ articleId }) {
        this.articleId = articleId
    },
    data() {
        return {
            articleId: undefined,
            list: [],
            comment: ''
        }
    },
    onPullDownRefresh() {
        this.init()
    },
    onReachBottom() {
        this.getData()
    },
    onShow() {
        this.init()
    },
    methods: {
        init() {
            this.list = []
            this.initPagination()
            this.getData()
        },
        getData() {
            if (this.noMore) {
                return
            }
            const params = {
                targetId: this.articleId,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            this.$message.loading()
            commentModel.list(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.list = uniqBy([... this.list, ... res.data.list], 'commentId')
                        this.pageNo++
                    } else {
                        this.noMore = true
                    }
                }
            }).finally(() => {
                this.$message.hide()
                uni.stopPullDownRefresh()
            })
        },
        handleCreate() {
            if (!this.comment) {
                return this.$toast({ title: '哥们说点啥⑧' })
            }
            const params = {
                articleId: this.articleId,
                targetId: this.articleId,
                content: this.comment
            }
            this.$message.loading()
            commentModel.create(params).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '评论成功' })
                    this.init()
                }
            }).finally(() => {
                this.$message.hide()
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-comment{
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
