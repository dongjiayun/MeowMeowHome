<template>
    <pa-popup
        ref="popup"
        background="#FFF"
        custom
        no-padding
    >
        <view class="pa-select-popup">
            <view class="pa-select-popup-body">
                <view
                    v-for="(item,index) in opts"
                    :key="index"
                    class="pa-select-popup-body-item"
                    :class="{ active: current === item.value }"
                    @click="handleChoose(item)"
                >{{ item.label }}</view>
            </view>
            <view class="pa-select-popup-footer" @click="handleCancel">
                取消
            </view>
        </view>
    </pa-popup>
</template>

<script>
export default {
    name: 'PaSelectPopup',
    props: {
        opts: Array,
    },
    data() {
        return {
            current: undefined
        }
    },
    methods: {
        open(value) {
            this.current = value
            this.$refs.popup.open()
        },
        close() {
            this.$refs.popup.close()
        },
        handleCancel() {
            this.$refs.popup.close()
        },
        handleChoose(item) {
            this.$emit('choose', item.value)
            this.$refs.popup.close()
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-select-popup{
    background: #F2F2F2;
    &-body{
        margin-bottom: 16rpx;
        &-item{
            padding:40rpx 0;
            font-size: 34rpx;
            font-weight: 400;
            color: #332C22;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            &.active{
                color: #F28900;
            }
        }
        &-item + &-item{
            border-top: 1rpx #ddd solid;
        }
    }
    &-footer{
        padding:32rpx 0 ;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 34rpx;
        font-weight: 400;
        color: #000000;
        background: #fff;
    }
}
</style>
