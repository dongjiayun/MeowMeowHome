<template>
    <view class="pa-menu-tabs" :style="{ background }">
        <scroll-view scroll-x>
            <view class="pa-menu-tabs-main" :class="{ isCenter }">
                <view
                    v-for="(item,index) in opts"
                    :key="index"
                    class="pa-menu-tabs-main-item"
                    @click="handleClick(item)"
                >
                    <view class="pa-menu-tabs-main-item-label" :class="{ active: value === item.value }">{{ item.label }}</view>
                    <view v-if="value === item.value" class="pa-menu-tabs-main-item-underline" />
                </view>
            </view>
        </scroll-view>
        <view
            class="pa-menu-tabs-cover left"
            :style="{ background: `linear-gradient(to right,${background},rgba(255,255,255,0));` }"
        />
        <view
            class="pa-menu-tabs-cover right"
            :style="{ background: `linear-gradient(to left,${background},rgba(255,255,255,0));` }"
        />
    </view>
</template>

<script>
export default {
    name: 'PaGoodsMenuTabs',
    props: {
        value: [String, Number],
        opts: Array,
        isCenter: Boolean,
        background: {
            type: String,
            default: '#fff'
        }
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
.pa-menu-tabs{
    position: relative;
    &-main{
        display: flex;
        align-items: center;
        padding:0 44rpx;
        &.isCenter{
            justify-content: space-around;
        }
        &-item{
            height: 88rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
            &-label{
                font-size: 28rpx;
                font-weight: 400;
                color: rgba(0,0,0,0.5);
                line-height: 40rpx;
                transition: all .1s;
                z-index: 1;
                &.active{
                    font-size: 34rpx;
                    font-weight: 500;
                    color: #332C22;
                }
            }
            &-underline{
                position: absolute;
                bottom: 22rpx;
                width: 96rpx;
                height: 12rpx;
                background: #FFAA2C;
                border-radius: 6rpx;
            }
        }
        &-item+&-item{
            margin-left: 48rpx;
        }
    }
    &-cover{
        position: absolute;
        top:0;
        height: 88rpx;
        width: 40rpx;
        &.left{
            left: 0;
            background: linear-gradient(to right,#fff,rgba(255,255,255,0));
        }
        &.right{
            right: 0;
            background: linear-gradient(to left,#fff,rgba(255,255,255,0));
        }
    }
}
</style>
