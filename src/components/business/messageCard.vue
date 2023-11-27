<template>
    <view class="pa-message-card">
        <view class="pa-message-card-header" @click="handleGotoUserDetail">
            <image class="pa-message-card-header-avatar" :src="avatar" />
            <view class="pa-message-card-header-username">{{ username }}</view>
            <view class="pa-message-card-header-date">{{ dayjs(data.createAt).format('YYYY-MM-DD HH:mm:ss') }}</view>
        </view>
        <view class="pa-message-card-body">
            {{ data.content }}
        </view>
        <view class="pa-message-card-footer">
            <view v-if="isLike" class="pa-message-card-footer-item" @click.stop="handleUnLike">
                <text>{{ toThousandsNum(likeCount ,0) }} </text>
                <uni-icons color="#FF824C" type="heart-filled" size="16" />
            </view>
            <view v-else class="pa-message-card-footer-item" @click.stop="handleLike">
                <text>{{ toThousandsNum(likeCount ,0) }} </text>
                <uni-icons color="#FF824C" type="heart" size="16" />
            </view>
            <view v-if="isSelf" class="pa-message-card-footer-item" @click.stop="handleDelete">
                <uni-icons color="#FF824C" type="trash" size="16" />
            </view>
        </view>
    </view>
</template>

<script>
import { getRandomCover, toThousandsNum } from '@/utils'
import dayjs from 'dayjs'
import { messageModel } from '@/api'
import { uniqBy } from 'lodash'
import { mapGetters } from 'vuex'
export default {
    name: 'MessageCard',
    props: {
        data: Object,
        readonly: Boolean
    },
    data() {
        return {
            message: '',
            messages: [],
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
        messageCount() {
            return this.data.childrenmessageIds?.length || 0
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
        handleGotoUserDetail() {
            if (this.data.author?.cid) {
                this.$Router.push({
                    name: 'user',
                    query: {
                        cid: this.data.author?.cid
                    }
                })
            }
        },
        handleLike() {
            messageModel.like(this.data.messageId).then(res => {
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
            messageModel.unLike(this.data.messageId).then(res => {
                if (res.status === 0) {
                    this.isLike = false
                    this.likeCount--
                    this.$toast({ title: '取消点赞成功' })
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
.pa-message-card{
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
    &-message{
        margin-top: 16rpx;
    }
}
</style>
