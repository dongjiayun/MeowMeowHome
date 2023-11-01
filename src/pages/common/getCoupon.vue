<template>
    <pa-container
        ref="container"
        is-page
        class="pa-get-coupon"
        background="#F5F5F5"
        share-title="盟宠星球纪给你发券啦"
        use-origin-cover
    >
        <view class="pa-get-coupon-header">
            <pa-navbar light />
        </view>
        <view
            class="pa-get-coupon-main"
        >
            <view
                class="pa-get-coupon-main-coupon"
                :class="{ gray: !isValid }"
            >
                <view class="pa-get-coupon-main-coupon-wrap">
                    <view class="pa-get-coupon-main-coupon-title">{{ data.couponName }}</view>
                    <template v-if="data.couponType === 1">
                        <view
                            class="pa-get-coupon-main-coupon-reduction"
                            :class="String(data.discountAmount).length > 5 ? (String(data.discountAmount).length < 9 ? 'middle' : 'small') : ''"
                        >
                            <view class="pa-get-coupon-main-coupon-reduction-unit">¥</view>
                            <view class="pa-get-coupon-main-coupon-reduction-number">{{ toThousandsNumByPenny(data.discountAmount) }}</view>
                        </view>
                        <view class="pa-get-coupon-main-coupon-remark">
                            {{ data.useScope }} {{ data.useThreshold }}
                            <view class="pa-get-coupon-main-coupon-remark-triangle" />
                        </view>
                    </template>
                    <template v-if="data.couponType === 2">
                        <view
                            class="pa-get-coupon-main-coupon-reduction "
                        >
                            <view class="pa-get-coupon-main-coupon-reduction-number middle">{{ data.couponAlias }}</view>
                        </view>
                        <view class="pa-get-coupon-main-coupon-remark">
                            {{ data.useScope }} {{ data.useThreshold }}
                            <view class="pa-get-coupon-main-coupon-remark-triangle" />
                        </view>
                    </template>
                    <template v-if="data.couponType === 6">
                        <view
                            class="pa-get-coupon-main-coupon-reduction"
                        >
                            <view class="pa-get-coupon-main-coupon-reduction-number middle">赠品券</view>
                        </view>
                        <view class="pa-get-coupon-main-coupon-remark">
                            {{ data.couponAlias.split(',')[0] }}
                            <view class="pa-get-coupon-main-coupon-remark-triangle" />
                        </view>
                    </template>
                    <view class="pa-get-coupon-main-coupon-verifyTime">{{ data.validTimeRangeDesc }}</view>
                </view>
            </view>
            <view
                class="pa-get-coupon-main-button"
                :class="{ disabled: !isValid }"
                @click="handleGet"
            >{{ !isValid ? (data.started ? '活动已结束' : '活动未开始' ) : hasGot ? '去使用' : '立即领取' }}</view>
        </view>
        <view class="pa-get-coupon-goods">
            <view class="pa-get-coupon-goods-title">
                <view>可用券商品</view>
            </view>
            <view v-if="list && list.length > 0" class="pa-get-coupon-goods-main">
                <pa-water-fall :data="list">
                    <template #default="{ item }">
                        <goods-card
                            :data="item"
                            class="pa-home-recommend-main-item"
                        />
                    </template>
                </pa-water-fall>
            </view>
            <pa-empty v-else label="暂无推荐~" />
            <pa-logo />
        </view>
    </pa-container>
</template>

<script>
import goodsCard from '@/components/mall/goodsCard'
import { couponModel } from '@/api'
import { toThousandsNumByPenny, uuid, query2Json, isNullOrEmpty } from '@/utils'
import pagination from '@/mixin/pagination'
import { uniqBy } from 'lodash'
import dayjs from 'dayjs'

export default {
    name: 'GetCoupon',
    components: { goodsCard },
    mixins: [pagination],
    onLoad({ couponId, scene, isFromRetryLastPage }) {
        if (couponId) {
            this.couponId = couponId
            return
        }
        if (scene) {
            let _scene = decodeURIComponent(scene)
            if (isFromRetryLastPage) {
                _scene = decodeURIComponent(_scene)
            }
            const sceneQuery = query2Json(_scene)
            if (sceneQuery.couponId) {
                this.couponId = sceneQuery.couponId
            }
        }
    },
    data() {
        return {
            data: {},
            couponId: undefined,
            list: [],
            hasGot: false
        }
    },
    computed: {
        isValid() {
            return this.data.started &&
                this.data.couponStatus === 'NORMAL' &&
                dayjs(this.data.invalidTime).valueOf() > new Date().getTime()
        },
        couponType() {
            return this.data?.couponType
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
            this.pageNo++
            this.queryCouponProduct()
        }
    },
    methods: {
        toThousandsNumByPenny,
        async init() {
            this.initPagination()
            this.list = []
            await this.getCouponDetail()
            await this.queryCouponProduct()
            uni.stopPullDownRefresh()
        },
        getCouponDetail() {
            const params = {
                couponIds: [this.couponId]
            }
            this.$message.loading()
            return couponModel.queryCouponTemplate(params).then(res => {
                if (res.status === 0) {
                    this.data = res.data?.[0] || {}
                    console.log('this.data', this.data)
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        queryCouponProduct() {
            if (isNullOrEmpty(this.couponType)) {
                return
            }
            let params
            if (this.couponType === 6) {
                params = {
                    couponId: this.couponId
                }
            } else {
                params = {
                    couponIds: [this.couponId],
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                }
            }
            this.$message.loading()
            return couponModel[this.couponType === 6 ? 'queryGiftCouponProduct' : 'queryCouponProduct'](params).then(res => {
                // availableItems
                if (this.couponType === 6) {
                    if (res.status === 0) {
                        const { availableItems } = res.data
                        this.list = availableItems.map(i => {
                            return {
                                ...i,
                                coverImgUrl: i.imageLink,
                                productName: i.skuName,
                                isGift: true
                            }
                        }) || []
                        this.noMore = true
                    } else {
                        this.$toast({ title: res.message })
                    }
                } else {
                    if (res.status === 0) {
                        const { totalPage, list } = res.data
                        this.list = uniqBy([...this.list, ...list], 'productId')
                        this.noMore = totalPage === this.pageNo || totalPage === 0
                    } else {
                        this.$toast({ title: res.message })
                    }
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        handleGet() {
            if (!this.isValid) {
                return
            }
            if (this.hasGot) {
                return this.$Router.push({
                    name: 'coupon',
                    query: {
                        couponType: this.couponType
                    }
                })
            }
            const params = {
                couponId: this.couponId,
                requestId: uuid(),
            }
            this.$message.loading()
            couponModel.drawCoupon(params).then(res => {
                if (res.status === 0) {
                    if (res.data) {
                        this.hasGot = true
                        this.$toast({ title: '领取成功' })
                    }
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

<style lang="scss" scoped>
.pa-get-coupon{
    position: relative;
    &-header{
        z-index: 10;
        position: fixed;
        top: 0;
    }
    &-main{
        height: 1096rpx;
        display: flex;
        align-items: center;
        flex-direction: column;
        background: url('https://res.ipetapi.com/miniprogram/mall/get_coupon_bg.png') no-repeat center/cover;
        &-coupon{
            width: 700rpx;
            height: 520rpx;
            margin-top: 440rpx;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: url('https://res.ipetapi.com/miniprogram/mall/coupon_bg.png') no-repeat center/cover;
            &.gray{
                background: url('https://res.ipetapi.com/miniprogram/mall/coupon_bg_gray.png') no-repeat center/cover;
                .pa-get-coupon-main-coupon-wrap{
                    filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
                    -moz-filter: grayscale(100%);
                    -ms-filter: grayscale(100%);
                    -o-filter: grayscale(100%);
                    -webkit-filter: grayscale(100%);
                    filter: grayscale(100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }
            }
            &-title{
                font-size: 28rpx;
                font-weight: 400;
                color: #332C22;
                line-height: 40rpx;
                position: relative;
                margin-bottom: 30rpx;
                text-align: center;
            }
            &-reduction{
                display: flex;
                align-items: flex-start;
                justify-content: center;
                font-weight: bold;
                color: #FB6D1E;
                flex-wrap: nowrap;
                position: relative;
                margin-bottom: 20rpx;
                &-unit{
                    font-size: 64rpx;
                    line-height: 78rpx;
                }
                &-number{
                    font-size: 120rpx;
                    line-height: 120rpx;
                    &.middle{
                        font-size: 80rpx;
                    }
                }
                &.middle{
                    .pa-coupon-promotion-board-main-reduction-unit{
                        font-size: 40rpx;
                        line-height: 60rpx;
                    }
                    .pa-coupon-promotion-board-main-reduction-number{
                        font-size: 80rpx;
                    }
                }
                &.small{
                    .pa-coupon-promotion-board-main-reduction-unit{
                        font-size: 28px;
                        line-height: 32px;
                    }
                    .pa-coupon-promotion-board-main-reduction-number{
                        font-size: 50px;
                    }
                }
            }
            &-remark{
                height: 56rpx;
                border-radius: 56rpx;
                background: #000;
                font-size: 28rpx;
                font-weight: 500;
                color: rgba(255,255,255,0.9);
                padding:6rpx 32rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                margin-bottom: 40rpx;
                &-triangle{
                    position: absolute;
                    left: 50%;
                    transform:translateX(-50%);
                    top:-32rpx;
                    border-bottom:solid 16rpx  #000;
                    border-top:solid 16rpx  transparent;
                    border-left:solid 12rpx  transparent;
                    border-right:solid 12rpx  transparent;
                }
            }
            &-verifyTime{
                font-size: 24rpx;
                font-weight: 400;
                color: rgba(0,0,0,0.5);
                line-height: 34rpx;
                position: relative;
                margin-bottom: 60rpx;
                text-align: center;
            }
        }
        &-button{
            width: 640rpx;
            height: 80rpx;
            background: linear-gradient(360deg, #FFBB33 0%, #FFF1B2 100%);
            box-shadow: 0rpx 16rpx 40rpx 0rpx #F66600, 0rpx 6rpx 12rpx 0rpx #FFA629, inset 0rpx -4rpx 12rpx 0rpx rgba(255,241,200,0.5), inset 0rpx 0rpx 4rpx 0rpx #FFEFBD;
            border-radius: 44rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30rpx;
            font-weight: 500;
            color: #F45506;
            margin-top:-36rpx ;
            &.disabled{
                background: linear-gradient(360deg, #B3B3B3 0%, #E9E9E9 100%);
                box-shadow: 0rpx 16rpx 40rpx 0rpx #F66600, 0rpx 6rpx 12rpx 0rpx #FFA629, inset 0rpx -4rpx 12rpx 0rpx rgba(229,229,229,0.5), inset 0rpx 0rpx 4rpx 0rpx #E9E9E9;
                color: #787878;
            }
        }
    }
    &-goods{
        background: #F5F5F5;
        border-radius: 16rpx;
        position: relative;
        top:-16rpx;
        &-title{
            padding:20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30rpx;
            font-weight: 500;
            color: #332C22;
        }
        &-main{
            padding:0 16rpx;
        }
    }
}
</style>
