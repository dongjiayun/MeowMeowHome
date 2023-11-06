<template>
    <pa-container
        is-page
        background="#FFAA2C"
    >
        <view class="pa-mine">
            <view class="pa-mine-header">
                <pa-navbar>我的</pa-navbar>
            </view>
            <view class="pa-mine-body">
                <view
                    class="pa-mine-body-avatar"
                >
                    <image
                        mode="aspectFill"
                        class="pa-mine-body-avatar-image"
                        :src="avatar"
                        @click="$Router.push({ name: 'memberConfig' })"
                    />
                    <view
                        class="pa-mine-body-avatar-name"
                    >
                        <view class="pa-mine-body-avatar-name-username">{{ profileData.username || '匿名猫猫' }}</view>
                    </view>
                </view>
            </view>
        </view>
    </pa-container>
</template>

<script>
import { getRandomCover } from '@/utils'
import { getThumb } from '@/utils/obs'
export default {
    data: function() {
        return {
            profileData: {}
        }
    },
    computed: {
        avatar() {
            return this.profileData.avatar?.fileUrl || getRandomCover()
        }
    },
    methods: {
        getThumb
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
    }
    &-body{
        margin-top: 20rpx;
        &-avatar{
            display: flex;
            align-items: center;
            padding-left: 40rpx;
            margin-bottom: 48rpx;
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
                    color: #332C22;
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
    }
}
</style>
