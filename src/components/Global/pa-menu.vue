<template>
    <view class="pa-menu">
        <button
            v-for="(item,index) in data"
            :key="index"
            class="pa-menu-item pa-mall-button-emtpy"
            :open-type="item.openType"
            @click="handleClick(item,$event)"
            @chooseavatar="handleChooseAvatar"
        >
            <view class="pa-menu-item-label">{{ item.label }}</view>
            <view class="pa-menu-item-right">
                <image v-if="item.image" :src="item.image" mode="aspectFill" class="pa-menu-item-right-image" :class="{ round: item.roundImage }" />
                <view v-if="item.text" :style="{ color: item.color }" class="pa-menu-item-right-text">{{ item.text }}</view>
                <image v-if="item.func" class="pa-menu-item-right-icon" :src="require('@/static/global/right.png')" />
            </view>
        </button>
    </view>
</template>

<script>
import { upload } from '@/utils/obs'
export default {
    name: 'PaMenu',
    props: {
        data: Array
    },
    methods: {
        /* uniapp微信小程序端使用对象传递方法时,方法会丢失
        https://blog.csdn.net/py_boy/article/details/107089150
        */
        handleClick(item, e) {
            if (item.func) this.$emit('click', item, e)
        },
        async handleChooseAvatar(e) {
            const file = { path: e.detail.avatarUrl }
            const avatar = await upload({
                data: file,
                module: 'miniprogram',
            })
            this.$emit('chooseAvatar', avatar)
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-menu{
    background: #FFFFFF;
    border-radius: 16rpx;
    padding-left:24rpx;
    &-item{
       height: 104rpx;
        padding-right: 24rpx;
        display: flex;
        justify-content: space-between;
        &-label{
            display: flex;
            align-items: center;
            font-size: 30rpx;
            font-weight: 400;
            color: #332C22;
        }
        &-right{
            display: flex;
            align-items: center;
            &-image{
                width: 72rpx;
                height: 72rpx;
                margin-right: 16rpx;
                &.round{
                    border-radius: 72rpx;
                }
            }
            &-text{
                font-size: 30rpx;
                font-weight: 400;
                color: rgba(0,0,0,0.5);
                line-height: 42rpx;
                margin-right: 16rpx;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width:500rpx;
                text-align: right;
            }
            &-icon{
                width: 24rpx;
                height: 24rpx;
            }
        }
    }
    &-item+&-item{
        border-top: 1rpx solid #EEEEEE;
    }
}
</style>
