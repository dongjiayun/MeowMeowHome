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
        <view class="pa-tabbar-member" @click="handleGoToMember">
            <image
                v-if="!token"
                mode="aspectFill"
                class="pa-tabbar-member-image"
                :src="memberMap.notLogin"
            />
            <image
                v-else-if="!isMember"
                mode="aspectFill"
                class="pa-tabbar-member-image"
                :src="memberMap.notLogin"
            />
            <image
                v-else
                mode="aspectFill"
                class="pa-tabbar-member-image"
                :src="memberMap[memberLevel]"
            />
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
            memberMap: {
                notLogin: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_member_center.png',
                0: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_become_member.png',
                1: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_v1.png',
                2: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_v2.png',
                3: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_v3.png',
                4: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_v4.png',
                5: 'https://qa-res.ipetapi.com/miniprogram/mall/tabbar_v5.png'
            },
        }
    },
    computed: {
        ...mapGetters(['token', 'memberLevel', 'isMember']),
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
            this.checkIsMember()
        },
        async checkIsMember() {
            if (!this.token) return
            return this.$store.dispatch('getMemberLevel')
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
            return this.$store.state.mall?.[bind]
        },
        handleGoToMember() {
            if (this.token && !this.isMember) {
                this.$Router.push({ name: 'joinMember' })
            } else {
                this.$Router.push({ name: 'member' })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
    &-member{
        &-image{
            position: relative;
            top:-40rpx;
            width: 120rpx;
            height: 120rpx;
        }
    }
}
</style>
