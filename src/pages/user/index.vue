<template>
    <pa-container
        is-page
        disable-share
        background="#FFAA2C"
    >
        <view class="pa-mine">
            <view class="pa-mine-header">
                <pa-navbar>我的</pa-navbar>
                <view
                    class="pa-mine-header-avatar"
                >
                    <image
                        mode="aspectFill"
                        class="pa-mine-header-avatar-image"
                        :src="avatar"
                    />
                    <view
                        class="pa-mine-header-avatar-name"
                    >
                        <view class="pa-mine-header-avatar-name-username">{{ profileData.username || '匿名猫猫' }}</view>
                    </view>
                </view>
                <view class="pa-mine-header-tabs">
                    <pa-tabs
                        v-model="tab"
                        :tabs="tabs"
                        @change="handleTabChange"
                    />
                </view>
            </view>
            <view class="pa-mine-body">
                <pa-empty v-if="list.length === 0" />
                <pa-water-fall v-if="tab === 0" :data="list">
                    <template #default="{ item }">
                        <article-card
                            :data="item"
                            class="pa-home-page-body-item"
                        />
                    </template>
                </pa-water-fall>
                <view v-if="tab === 1">
                    <user-card
                        v-for="(item,index) in list"
                        :key="index"
                        :data="item"
                    />
                </view>
                <view v-if="tab === 2">
                    <user-card
                        v-for="(item,index) in list"
                        :key="index"
                        :data="item"
                    />
                </view>
            </view>
            <pa-logo color="#fff" double-bottom-padding />
        </view>
    </pa-container>
</template>

<script>
import { getRandomCover } from '@/utils'
import { getThumb } from '@/utils/obs'
import { articleModel, userModel } from '@/api'
import { mapGetters } from 'vuex'
import articleCard from '@/components/business/articleCard.vue'
import userCard from '@/components/business/userCard.vue'
import pagination from '@/mixin/pagination'
import { uniqBy } from 'lodash'
export default {
    components: { articleCard, userCard },
    mixins: [pagination],
    data: function() {
        return {
            cid: undefined,
            profileData: {},
            tab: 0,
            tabs: ['小作文', '关注', '粉丝'],
            list: []
        }
    },
    onLoad({ cid }) {
        this.cid = cid
    },
    computed: {
        avatar() {
            return this.profileData.avatar?.fileUrl || getRandomCover()
        }
    },
    mounted() {
        this.init()
    },
    onPullDownRefresh() {
        this.init()
    },
    onReachBottom() {
        if (!this.noMore) {
            this.getData()
        }
    },
    methods: {
        getThumb,
        init() {
            this.list = []
            this.getProfile()
            this.getData()
        },
        getProfile() {
            userModel.info(this.cid).then(res => {
                if (res.status === 0) {
                    this.profileData = res.data
                    this.setForm()
                } else {
                    this.$toast({ title: res.message })
                }
            })
        },
        handleTabChange(tab) {
            this.tab = tab
            this.initPagination()
            this.list = []
            this.getData()
        },
        getData() {
            switch (this.tab) {
                case 0:
                    this.getArticle()
                    break
                case 1:
                    this.getFollows()
                    break
                case 2:
                    this.getFollowers()
                    break
            }
        },
        getArticle() {
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                cid: this.cid
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
        },
        getFollows() {
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                cid: this.cid
            }
            this.$message.loading()
            userModel.getFollows(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.list = uniqBy([... this.list, ... res.data.list], 'cid')
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
        getFollowers() {
            const params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                cid: this.cid
            }
            this.$message.loading()
            userModel.getFollowers(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        this.list = uniqBy([... this.list, ... res.data.list], 'cid')
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
.pa-mine{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
        background: #FFAA2C;
        &-avatar{
            display: flex;
            align-items: center;
            padding:0 40rpx;
            margin-bottom: 48rpx;
            margin-top: 60rpx;
            &-image{
                width: 96rpx;
                height: 96rpx;
                border-radius: 96rpx;
                border: 4rpx solid rgba(255,255,255,0.4);
                margin-right: 18rpx;
            }
            &-name{
                &-username{
                    font-size: 30rpx;
                    font-weight: 500;
                    color: #fff;
                    line-height: 42rpx;
                }
                &-sign{
                    background: linear-gradient(90deg, #FFFAED 0%, #FFFEFC 100%);
                    border-radius: 24rpx;
                    padding:4rpx 18rpx 4rpx 12rpx;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 8rpx;
                    &-image{
                        width: 40rpx;
                        height: 40rpx;
                        margin-right: 4rpx;
                    }
                    &-text{
                        font-size: 24rpx;
                        font-weight: 500;
                        color: #F28900;
                        line-height: 34rpx;
                    }
                }
            }
        }
        &-tabs{
            overflow: hidden;
            border-top-left-radius: 36rpx;
            border-top-right-radius: 36rpx;
        }
    }
    &-body{
        background: #f5f5f5;
        border-bottom-left-radius: 36rpx;
        border-bottom-right-radius: 36rpx;
        padding:16rpx;
    }
}
</style>
