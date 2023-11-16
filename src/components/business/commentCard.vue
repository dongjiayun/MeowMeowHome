<template>
    <view class="pa-comment-card">
        <view class="pa-comment-card-header">
            <image class="pa-comment-card-header-avatar" :src="avatar" />
            <view class="pa-comment-card-header-username">{{ username }}</view>
            <view class="pa-comment-card-header-date">{{ dayjs(data.createAt).format('YYYY-MM-DD HH:mm:ss') }}</view>
        </view>
        <view class="pa-comment-card-body">
            {{ data.content }}
        </view>
        <view class="pa-comment-card-footer">
            <view class="pa-comment-card-footer-item">
                <text>{{ toThousandsNum(data.likesCount || 0 ,0) }} </text>
                <uni-icons color="#FF824C" type="heart" size="16" />
            </view>
            <view class="pa-comment-card-footer-item" @click="handleComment">
                <text>{{ toThousandsNum(data.likesCount || 0,0) }} </text>
                <uni-icons color="#FF824C" type="chat" size="16" />
            </view>
        </view>
        <view v-if="showComment" class="pa-comment-card-comment">
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
        </view>
    </view>
</template>

<script>
import { getRandomCover, toThousandsNum } from '@/utils'
import dayjs from 'dayjs'
import customSearchBar from '@/components/custom-search-bar/index.vue'
export default {
    name: 'CommentCard',
    components: { customSearchBar },
    props: {
        data: Object
    },
    data() {
        return {
            showComment: false,
            comment: '',
        }
    },
    computed: {
        avatar() {
            return this.data.author?.avatar?.fileUrl || getRandomCover()
        },
        username() {
            return this.data.author?.username || '匿名猫猫'
        }
    },
    methods: {
        toThousandsNum,
        dayjs,
        handleComment() {
            this.showComment = !this.showComment
        },
        handleCreate() {

        }
    }
}
</script>

<style scoped lang="scss">
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
