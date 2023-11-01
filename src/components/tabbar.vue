<template>
    <view
        v-if="isTabbar"
        class="pa-tabbar"
        :class="{ isTopIndex }"
        :style="{ boxShadow: hideShadow ? 'none' : '0px -8px 16px 0px rgba(51,51,51,0.06)' }"
    >
        <view
            v-for="(item,index) in leftTabs"
            :key="index"
            class="pa-tabbar-tabs"
        >
            <uni-badge
                type="error"
                absolute="rightTop"
                :text="item.bind ? getBind(item.bind) : undefined"
                :offset="[22,5]"
                @click="handleClick(item)"
            >
                <view
                    class="pa-tabbar-item"
                    @click="handleClick(item)"
                >
                    <image class="pa-tabbar-item-icon" :src="setTabIcon(item)" />
                    <view class="pa-tabbar-item-text" :class="{ active: $Router.checkCurrentRouteActive(item.path) }">{{ item.tabbarName }}</view>
                </view>
            </uni-badge>
        </view>
        <view class="pa-tabbar-create" @click="handleCreate">
            <view class="pa-tabbar-create-button">
                <view class="pa-tabbar-create-button-leftear" />
                <view class="pa-tabbar-create-button-rightear" />
                <uni-icons type="plusempty" size="30" color="#fff" />
            </view>
        </view>
        <view
            v-for="(item,index) in rightTabs"
            :key="index"
            class="pa-tabbar-tabs"
        >
            <uni-badge
                type="error"
                absolute="rightTop"
                :text="item.bind ? getBind(item.bind) : undefined"
                :offset="[22,5]"
                @click="handleClick(item)"
            >
                <view
                    class="pa-tabbar-item"
                    @click="handleClick(item)"
                >
                    <image class="pa-tabbar-item-icon" :src="setTabIcon(item)" />
                    <view class="pa-tabbar-item-text" :class="{ active: $Router.checkCurrentRouteActive(item.path) }">{{ item.tabbarName }}</view>
                </view>
            </uni-badge>
        </view>
    </view>
</template>

<script>
import routes from '../router/routes.config'
import { mapGetters } from 'vuex'

export default {
    name: 'Tabbar',
    data() {
        return {
            tabs: this.$storage.get('pa-tabbar') ?? [],
            isTopIndex: false,
        }
    },
    computed: {
        ...mapGetters(['token']),
        hideShadow() {
            return this.$Router.checkCurrentRouteHideTabbarShadow()
        },
        isTabbar() {
            return this.$Router.checkCurrentRouteIsTabbar()
        },
        leftTabs() {
            return this.tabs.filter((i, inx) => {
                return inx <= Math.floor((this.tabs.length - 1) / 2)
            })
        },
        rightTabs() {
            return this.tabs.filter((i, inx) => {
                return inx > Math.floor((this.tabs.length - 1) / 2)
            })
        },
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.isTopIndex = false
        // uni.$off('setTarbarTopIndex')
    },
    methods: {
        init() {
            this.tabs = routes.filter(i => {
                return !!i.isTabbar
            })
            this.$storage.set('pa-tabbar', this.tabs)
            uni.$on('setTarbarTopIndex', isTopIndex => {
                this.isTopIndex = isTopIndex
            })
        },
        setTabIcon({ tabActiveIcon, tabInactiveIcon, path }) {
            const isActive = this.$Router.checkCurrentRouteActive(path)
            return isActive ? tabActiveIcon : tabInactiveIcon
        },
        handleClick({ name }) {
            if (this.$Router.getCurrentRouteName() !== name) {
                this.$Router.redirectTo({ name })
            }
        },
        getBind(bind) {
            return this.$store.state.business?.[bind]
        },
        handleCreate() {
            this.$Router.push({ name: 'create' })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles";
.pa-tabbar{
    z-index: 10;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100vw;
    padding:12rpx 12rpx 60rpx;
    background: #FFFFFF;
    height: calc(120rpx + env(safe-area-inset-bottom));
    &-tabs{
        flex:1;
        display: flex;
        align-items: baseline;
        justify-content: space-around;
    }
    &.isTopIndex{
        z-index: 999;
    }
    &-item{
        padding:0 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-icon{
            width: 56rpx;
            height: 56rpx;
        }
        &-text{
            font-size: 20rpx;
            font-weight: 400;
            color: #332C22;
            margin-top: 8rpx;
            line-height: 28rpx;
            &.active{
                font-weight: 600;
            }
        }
    }
    &-create{
        &-button{
            @mixin ear {
                position: absolute;
                top:-10rpx;
                width: 20rpx;
                height: 20rpx;
                border-radius: 6rpx;
                background: $pingan-color;
                transform: rotate(45deg);
            }
            position: relative;
            width: 120rpx;
            height: 80rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 32rpx;
            background: $pingan-color;
            &-leftear{
                @include ear;
                left: 26rpx;
            }
            &-rightear{
                @include ear;
                right: 26rpx;
            }
        }
    }
}
</style>
