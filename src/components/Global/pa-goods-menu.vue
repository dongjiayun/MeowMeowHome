<template>
    <view class="pa-menu">
        <scroll-view scroll-y :style="{ height }" class="pa-menu-sidebar">
            <view
                v-for="(item,index) in menu"
                :key="index"
                class="pa-menu-sidebar-item"
                :class="{
                    active: value === item.value,
                    aboveTheActive: index === currentIndex - 1 ,
                    belowTheActive: index === currentIndex + 1
                }"
                @click="handleClick(item)"
            >
                <view class="pa-menu-sidebar-item-label">
                    <text class="pa-menu-sidebar-item-label-text">{{ item.label }}</text>
                </view>
            </view>
            <view v-if="currentIndex === menu.length - 1" class="pa-menu-sidebar-item-bottom">
                <view class="pa-menu-sidebar-item-bottom-inner" />
            </view>
        </scroll-view>
        <view id="pa-menu-main" :style="{ height }" class="pa-menu-main">
            <!-- 微信小程序template 内的ref不能识别-->
            <slot :mainHeight="mainHeight" />
        </view>
    </view>
</template>

<script>
export default {
    name: 'PaGoodsMenu',
    props: {
        menu: Array,
        value: [String, Number],
        height: String
    },
    data() {
        return {
            mainHeight: 0
        }
    },
    computed: {
        currentIndex() {
            return this.menu.findIndex(i => i.value === this.value)
        },
    },
    mounted() {
        this.$nextTick(() => {
            const query = uni.createSelectorQuery().in(this)
            query.select('#pa-menu-main').boundingClientRect(data => {
                this.mainHeight = data.height - (this.$Router.checkCurrentRouteIsTabbar() ? uni.upx2px(120) : 0)
            }).exec()
        })
    },
    methods: {
        handleClick(item) {
            if (this.value !== item.value) {
                this.$emit('update:value', item.value)
                this.$emit('change', item)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-menu{
    background: #fff;
    display: flex;
    &-sidebar{
        width: 172rpx;
        background: #F5F5F5;
        &-item{
            height: 120rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            background: #fff;
            &-label{
                width: 172rpx;
                font-size: 28rpx;
                font-weight: 400;
                color: #332C22;
                line-height: 40rpx;
                height: 120rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #F5F5F5;
                &-text{
                    z-index: 1;
                }
            }
            &-sign{
                width: 40rpx;
                height: 38rpx;
                position: absolute;
                right: 10rpx;
                top:24rpx;
            }
            &.active{
                .pa-menu-sidebar-item-label{
                    font-weight: 500;
                    color: #332C22;
                    background: #FFFFFF;
                }
            }
            &.aboveTheActive{
                .pa-menu-sidebar-item-label{
                    border-radius: 0  0 16rpx 0;
                }
            }
            &.belowTheActive{
                .pa-menu-sidebar-item-label{
                    border-radius: 0 16rpx 0 0;
                }
            }
        }
        &-item-bottom{
            background: #fff;
            height: 16rpx;
            &-inner{
                border-radius: 0 16rpx 0 0;
                background: #F5F5F5;
                height: 16rpx;
            }
        }
    }
    &-main{
        flex:1;
    }
}
</style>
