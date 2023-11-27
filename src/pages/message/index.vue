<template>
    <pa-container
        ref="container"
        is-page
        disable-share
    >
        <view class="pa-message">
            <view class="pa-message-header">
                <pa-navbar>留言板</pa-navbar>
                <view class="pa-message-header-subtitle">没有登陆也可以留言哦~</view>
            </view>
            <view class="pa-message-body">
                <message-card
                    v-for="(item,index) in list"
                    :key="index"
                    :data="item"
                    @delete="handleDelete"
                />
                <pa-empty v-if="list.length === 0" />
                <pa-logo double-bottom-padding />
            </view>
            <pa-footer is-top-index>
                <custom-search-bar
                    v-model="comment"
                    cancel-text="发送"
                    placeholder="朋友们,说说你的想法吧!"
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
import messageCard from '@/components/business/messageCard.vue'
import { messageModel } from '@/api'
import pagination from '@/mixin/pagination'
import { uniqBy } from 'lodash'

export default {
    name: 'Comment',
    components: {
        customSearchBar,
        messageCard
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
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            this.$message.loading()
            messageModel.list(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.list = uniqBy([... this.list, ... res.data.list], 'messageId')
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
                content: this.comment
            }
            this.$message.loading()
            messageModel.create(params).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '留言成功' })
                    this.init()
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleDelete({ commentId }) {
            this.$refs.container.showConfirm({
                content: '确定要删除该留言吗?',
                confirm: () => {
                    this.$message.loading()
                    messageModel.delete(commentId).then(res => {
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
.pa-message{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
        background: #fff;
        &-subtitle{
            font-size: 24rpx;
            font-weight: 400;
            color: $pingan-color;
            text-align: center;
            padding: 16rpx;
        }
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
