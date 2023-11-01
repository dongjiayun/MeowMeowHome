<template>
    <view class="pet-type-trigger">
        <view class="cat" :class="{ active: active === 0 }">
            <image class="tab" :src="active === 0 ? require('../assets/tab_cat_up.png') : require('../assets/tab_cat.png')" @click="clickHandle(0)" />
            <image v-if="active === 0 && !isShowTip" class="radio-group-item__icon" :src="require('../assets/miao.png')" />

        </view>
        <view class="dog" :class="{ active: active === 1 }" @click.native="hideTipHandle">
            <image class="tab" :src="active === 1 ? require('../assets/tab_dog_up.png') : require('../assets/tab_dog.png')" @click="clickHandle(1)" />
            <image v-if="isShowTip" class="tip" :src="require('../assets/search-try.gif')" />
            <image v-if="active === 1 && !isShowTip" class="radio-group-item__icon" :src="require('../assets/wang.png')" />
        </view>
        <view class="container-area">
            <slot />
        </view>
    </view>
</template>

<script>
export default {
    name: 'PetTypeTrigger',
    props: {
        active: {
            type: Number,
            default: 0
        },
        showTip: Boolean,
        tipKey: String
    },
    data() {
        return {
            isShowTip: false
        }
    },
    mounted() {
        this.isShowTip = this.showTip
    },
    methods: {
        clickHandle(active) {
            this.$emit('update:active', active)
        },
        hideTipHandle() {
            this.isShowTip = false
            this.$storage.set(this.tipKey, true)
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin pet-tab{
    transition:all 0.15s;
    top:16rpx;
    z-index: 0;
    &.active{
        top:0;
        z-index: 20;
    }
}
.pet-type-trigger{
    position: relative;
    padding-top: 72rpx;
    .tab{
        width: 128rpx;
        height: 90rpx;
    }
    .cat{
        position: absolute;
        left: 22%;
        @include pet-tab;
        .radio-group-item__icon{
            width: 62rpx;
            height: 60rpx;
            position: absolute;
            opacity:0;
            right: -20rpx;
            top: -16rpx;
            z-index: 12;
            animation:fadenum 2s;
        }
        @keyframes fadenum{

            0%{opacity:0;}

            60%{opacity:1;}

            100%{opacity:0;}

        }
    }
    .dog{
        position: absolute;
        right: 22%;
        @include pet-tab;
        .tip{
            position: absolute;
            width:120rpx;
            height: 66rpx;
            top: -32rpx;
            right: -62rpx;
        }
        .radio-group-item__icon{
            width: 62rpx;
            height: 60rpx;
            position: absolute;
            opacity:0;
            right: -20rpx;
            top: -16rpx;
            z-index: 12;
            animation:fadenum 2s;
        }
        @keyframes fadenum{

            0%{opacity:0;}

            60%{opacity:1;}

            100%{opacity:0;}

        }
    }
    .container-area{
        position: relative;
        z-index: 10;
    }
}
</style>
