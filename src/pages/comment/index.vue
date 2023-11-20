<template>
    <pa-container
        ref="container"
        is-page
        disable-share
    >
        <view class="pa-comment">
            <view class="pa-comment-header">
                <pa-navbar>评论</pa-navbar>
            </view>
            <view class="pa-comment-body">
                <view v-if="showBack" class="pa-comment-body-back" @click="handleGotoArticle">转到小作文</view>
                <comment-card
                    v-for="(item,index) in list"
                    :key="index"
                    :data="item"
                    @delete="handleDelete"
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
    onLoad({ articleId, showBack }) {
        this.articleId = articleId
        this.showBack = showBack
    },
    data() {
        return {
            articleId: undefined,
            list: [],
            comment: '',
            showBack: false
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
            this.comment = ''
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
                } else {
                    this.$toast({ title: res.message })
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
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleGotoArticle() {
            this.$Router.push({
                name: 'articleDetail',
                query: {
                    articleId: this.articleId
                }
            })
        },
        handleDelete({ commentId }) {
            this.$refs.container.showConfirm({
                content: '确定要删除该评论吗?',
                confirm: () => {
                    this.$message.loading()
                    commentModel.delete(commentId).then(res => {
                        if (res.status === 0) {
                            this.$toast({ title: '删除成功' })
                            this.init()
                        } else {
                            this.$toast({ title: res.message })
                        }
                    }).finally(() => {
                        this.$message.hide()
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "@/styles";
.pa-comment{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
        background: #fff;
    }
    &-body{
        padding: 16rpx;
        &-back{
            padding: 16rpx;
            font-size: 24rpx;
            font-weight: 400;
            color: $pingan-color;
            margin-left: 8rpx;
        }
    }
}
</style>
