<template>
    <view class="pa-comment-card" @click="handleGotoDetail">
        <view class="pa-comment-card-header" @click="handleGotoUserDetail">
            <image class="pa-comment-card-header-avatar" :src="avatar" />
            <view class="pa-comment-card-header-username">{{ username }}</view>
            <view class="pa-comment-card-header-date">{{ dayjs(data.createAt).format('YYYY-MM-DD HH:mm:ss') }}</view>
        </view>
        <view class="pa-comment-card-body">
            {{ data.content }}
        </view>
        <view v-if="readonly" class="pa-comment-card-to-article" @click="handleGotoArticle">转到小作文</view>
        <view class="pa-comment-card-footer">
            <view v-if="isLike" class="pa-comment-card-footer-item" @click.stop="handleUnLike">
                <text>{{ toThousandsNum(likeCount ,0) }} </text>
                <uni-icons color="#FF824C" type="heart-filled" size="16" />
            </view>
            <view v-else class="pa-comment-card-footer-item" @click.stop="handleLike">
                <text>{{ toThousandsNum(likeCount ,0) }} </text>
                <uni-icons color="#FF824C" type="heart" size="16" />
            </view>
            <view class="pa-comment-card-footer-item" @click.stop="handleComment">
                <text>{{ toThousandsNum(commentCount,0) }} </text>
                <uni-icons color="#FF824C" type="chat" size="16" />
            </view>
            <view v-if="isSelf" class="pa-comment-card-footer-item" @click.stop="handleDelete">
                <uni-icons color="#FF824C" type="trash" size="16" />
            </view>
        </view>
        <view v-if="showComment" class="pa-comment-card-comment">
            <custom-search-bar
                v-if="!readonly"
                v-model="comment"
                cancel-text="发送"
                placeholder="说话,说话!"
                radius="100"
                @cancel="handleCreate"
                @confirm="handleCreate"
            >
                <template #searchIcon />
            </custom-search-bar>
            <pa-scroll-list
                v-show="comments && comments.length > 0"
                ref="list"
                :list="comments"
                :scroll-bar-height="comments.length > 3 ? '800rpx' : 266 * comments.length + 'rpx'"
                @load="handleLoad"
                @refresh="handleRefresh"
            >
                <view style="padding:24rpx">
                    <CommentCard
                        v-for="(item,index) in comments"
                        :key="index"
                        :readonly="readonly"
                        :data="item"
                        @delete="handleDelete"
                    />
                </view>
            </pa-scroll-list>
        </view>
    </view>
</template>

<script>
import { getRandomCover, toThousandsNum } from '@/utils'
import dayjs from 'dayjs'
import customSearchBar from '@/components/custom-search-bar/index.vue'
import { commentModel } from '@/api'
import { uniqBy } from 'lodash'
import commentCard from '@/components/business/commentCard.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'CommentCard',
    components: { customSearchBar, commentCard },
    props: {
        data: Object,
        readonly: Boolean
    },
    data() {
        return {
            showComment: false,
            comment: '',
            comments: [],
            isLike: false,
            likeCount: []
        }
    },
    computed: {
        ...mapGetters(['cid', 'isAdmin']),
        avatar() {
            return this.data.author?.avatar?.fileUrl || getRandomCover()
        },
        username() {
            return this.data.author?.username || '匿名猫猫'
        },
        commentCount() {
            return this.data.childrenCommentIds?.length || 0
        },
        isSelf() {
            return this.cid === this.data?.authorId || this.isAdmin
        },
    },
    mounted() {
        this.isLike = this.data.likeIds?.includes(this.cid)
        this.likeCount = this.data.likeIds?.length || 0
    },
    methods: {
        toThousandsNum,
        dayjs,
        handleComment() {
            this.showComment = !this.showComment
            if (this.showComment) {
                this.$refs.list?.refresh()
            }
        },
        handleCreate() {
            if (!this.comment) {
                return this.$toast({ title: '哥们说点啥⑧' })
            }
            const params = {
                articleId: this.data.articleId,
                targetId: this.data.commentId,
                content: this.comment,
                rootCommentId: this.data.rootCommentId || this.data.commentId
            }
            this.$message.loading()
            commentModel.create(params).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '评论成功' })
                    this.comment = ''
                    this.$refs.list?.refresh()
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        getComments() {
            this.$message.loading()
            const params = {
                targetId: this.data.commentId,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            return commentModel.list(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.comments = uniqBy([...this.comments, ...res.data.list], 'commentId')
                        return { list: this.data, total: res.data.totalCount }
                    } else {
                        this.$refs.list.loadEnd()
                    }
                } else {
                    this.$toast({ title: res.message })
                    this.$refs.list.loadFail()
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleLoad({ page }) {
            this.pageNo = page || 1
            this.getComments().then(({ list, total }) => {
                this.$refs.list.loadSuccess({ list, total })
            })
        },
        handleRefresh({ page }) {
            this.pageNo = page
            this.comments = []
            this.getComments().then(({ list, total }) => {
                this.$refs.list.refreshSuccess({ list, total })
            })
        },
        handleGotoUserDetail() {
            this.$Router.push({
                name: 'user',
                query: {
                    cid: this.data.author?.cid
                }
            })
        },
        handleLike() {
            if (this.readonly) return this.handleGotoDetail()
            commentModel.like(this.data.commentId).then(res => {
                if (res.status === 0) {
                    this.isLike = true
                    this.likeCount++
                    this.$toast({ title: '点赞成功' })
                } else {
                    this.$toast({ title: res.message })
                }
            })
        },
        handleUnLike() {
            if (this.readonly) return this.handleGotoDetail()
            commentModel.unLike(this.data.commentId).then(res => {
                if (res.status === 0) {
                    this.isLike = false
                    this.likeCount--
                    this.$toast({ title: '取消点赞成功' })
                }
            })
        },
        handleGotoDetail() {
            if (this.readonly) {
                this.$Router.push({
                    name: 'comment',
                    query: {
                        articleId: this.data.articleId,
                        showBack: true
                    }
                })
            }
        },
        handleGotoArticle() {
            this.$Router.push({
                name: 'articleDetail',
                query: {
                    articleId: this.data.articleId
                }
            })
        },
        handleDelete() {
            this.$emit('delete', this.data)
        }
    }
}
</script>

<style scoped lang="scss">
@import '@/styles';
.pa-comment-card{
    padding: 16rpx;
    background: #fff;
    border-radius: 16rpx;
    box-shadow:  0 0 20rpx 0 rgba(0,0,0,0.1);
    margin-bottom: 16rpx;
    &-header{
        display: flex;
        align-items: center;
        &-avatar{
            width: 60rpx;
            height: 60rpx;
            border-radius: 60rpx;
            margin-right: 12rpx;
        }
        &-username{
            font-size: 28rpx;
            font-weight: 500;
            color: #aaa;
            flex:1;
        }
        &-date{
            font-size: 24rpx;
            font-weight: 400;
            color: #aaa;
        }
    }
    &-body{
        font-size: 28rpx;
        font-weight: 400;
        color: #333;
        margin-top: 16rpx;
        padding:12rpx;
    }
    &-to-article{
        font-size: 24rpx;
        font-weight: 400;
        color: $pingan-color;
        margin-left: 8rpx;
    }
    &-footer{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &-item{
            display: flex;
            align-items: center;
            margin-left: 32rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #aaa;
        }
    }
    &-comment{
        margin-top: 16rpx;
    }
}
</style>
