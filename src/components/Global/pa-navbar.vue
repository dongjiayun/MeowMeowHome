<template>
    <view class="pet-navbar-box">
        <view class="false-box" :style="{ height: (iStatusBarHeight + 44) + 'px' }" />
        <view
            class="pet-navbar"
            :style="{
                width: '100%',
                height: (iStatusBarHeight + 44) + 'px',
                background: bgColor
            }"
        >
            <pa-status-bar />
            <custom-nav-bar
                :background-color="bgColor"
                :border="false"
                :class="['pet-navbar-container']"
                fixed="true"
                :style="{
                    top: iStatusBarHeight + 'px'
                }"
                :hide-left="hideBackAndHome"
            >
                <view
                    slot="left"
                    class="navbar-left"
                    :style="{ color: light ? '#fff' : '#000' }"
                >
                    <slot name="left">
                        <view
                            v-if="!hideBackAndHome"
                            class="btn-group"
                            :style="{
                                background: light ? 'rgba(0,0,0,0.15)' : 'rgba(255, 255, 255, 0.6)',
                            }"
                        >
                            <view class="btn-group-wrap" @click="goBack">
                                <image class="icon" :src="light ? require('@/components/common/back_white.png') : require('@/components/common/back.png')" />
                            </view>
                            <view class="btn-group-divider" :class="{ light }" />
                            <view class="btn-group-wrap" @click="goHome">
                                <image class="icon" :src="light ? require('@/components/common/home_white.png') : require('@/components/common/home.png')" />
                            </view>
                        </view>
                    </slot>
                </view>
                <view
                    class="navbar-title"
                    :class="{ alignLeft: hideBackAndHome }"
                    :style="{ color: light ? '#fff' : '#000' }"
                >
                    <slot />
                </view>
                <view slot="right" class="navbar-right">
                    <slot name="right" />
                </view>
            </custom-nav-bar>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import customNavBar from '@/components/custom-nav-bar'

export default {
    name: 'PetNavbar',
    components: { customNavBar },
    props: {
        bgType: {
            type: String,
            default: 'transparent'
        },
        fit: {
            type: Boolean,
            default: false
        },
        customBack: Boolean,
        customHome: Boolean,
        light: Boolean,
        coverBackgroundColor: {
            type: String,
            default: '#F5F5F5'
        },
        hideBackAndHome: Boolean
    },
    data() {
        return {
            iStatusBarHeight: 0
        }
    },
    computed: {
        bgColor() {
            if (this.fit) return 'transparent'
            else return this.bgType === 'white' ? this.coverBackgroundColor : 'transparent'
        },
        ...mapGetters(['statusBarHeight'])
    },
    created() {
        if (this.statusBarHeight) {
            this.iStatusBarHeight = this.statusBarHeight
        } else {
            const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
            this.iStatusBarHeight = statusBarHeight
            this.$store.dispatch('setStatusBarHeight', statusBarHeight)
        }
    },
    methods: {
        goBack() {
            const { customBack } = this
            const route = getCurrentPages()
            if (route.length === 1) this.$Router.reLaunch({ name: 'home' })
            if (customBack) {
                this.$emit('back')
            } else {
                this.$Router.back()
            }
        },
        goHome() {
            const { customHome } = this
            if (customHome) {
                this.$emit('home')
            } else {
                this.$Router.reLaunch({ name: 'home' })
            }
        }
    }
}
</script>

<style lang="scss">
.pet-navbar.home { background-color: #FFC74B; }
.false-box {
    position: relative;
    top: 0;
}
.pet-navbar {
    position: fixed;
    top: 0;
    z-index: 50;
    background-color: transparent;
    transition: all .1s;
    .pet-navbar-container {
        position: fixed;
        top: 0;
        height: 44px;
        display: flex;
        padding:0 12px;
        align-items: center;
        justify-content: space-between;
        //transition: all 0.3s;
        .navbar-right {
            font-size: 24rpx;
        }
        .navbar-left {
            position: absolute;
            .btn-group {
                width: 87px;
                height: 32px;
                border-radius: 50px;
                border: 1rpx solid rgba(151, 151, 151, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-around;
                .arrow {
                    margin: 0 10px;
                    width: 24px;
                    height: 32px;
                    line-height: 30px;
                    display: block;
                }
                &-wrap{
                    height: 32px;
                    .icon {
                        margin: 4px 9px;
                        width: 24px;
                        height: 24px;
                        float: left;
                    }
                }
                &-divider{
                    width: 1rpx;
                    height: 40rpx;
                    background: rgba(0,0,0,0.2);
                    &.light{
                        background: rgba(255,255,255,0.25);
                    }
                }
            }
        }
        .navbar-title {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            color: #000;
            font-size: 34rpx;
            font-weight: 500;
            font-family: SFProDisplay-Medium, SFProDisplay;
            white-space: nowrap;
            &.alignLeft{
                justify-content: start;
            }
        }

    }
}
</style>
