<template>
    <view class="pa-upload-mulit-image">
        <view
            v-if="!readonly"
            class="pa-upload-mulit-image-add"
            @click="addImages"
        >
            <image class="pa-upload-mulit-image-add-icon" :src="require('@/static/global/camera.png')" />
            <view class="pa-upload-mulit-image-add-title">{{ title }}</view>
            <view class="pa-upload-mulit-image-add-subtitle">最多{{ number }}张</view>
        </view>
        <view
            v-for="(item, index) in imageList"
            :key="index"
            class="pa-upload-mulit-image-item"
        >
            <view class="pre-image" @click="previewImage(item)">
                <view v-if="['mp4', 'mov'].some(i => item.src.toLowerCase().includes(i))" class="pre-image-video">
                    <image
                        :src="item.src + '?vframe/jpg/offset/0'"
                        style="width: 100%;height: 100%"
                        mode="aspectFill"
                    />
                    <image class="pre-image-play" :src="require('@/static/global/play.png')" />
                </view>
                <image v-else :src="getThumb(item.src,10)" style="width: 100%;height: 100%" mode="aspectFill" />
            </view>
            <uni-icons
                v-if="!readonly"
                class="pa-upload-mulit-image-item-clear"
                :size="24"
                type="clear"
                @click="delImage(item, index)"
            />
        </view>
        <pa-photo-picker ref="photo" :extension="extension" :type="type" :count="number - list.length" @choose="sourceSubmit" />
    </view>
</template>

<script>
import { getThumb } from '@/utils/obs'

export default {
    props: {
        list: {
            type: Array,
            default: function() {
                return []
            }
        },
        number: {
            type: Number,
            default: 6
        },
        custom: {
            type: Boolean,
            default: false
        },
        extension: Array,
        type: {
            type: String,
            default: 'all'
        },
        title: {
            type: String,
            default: '上传'
        },
        readonly: Boolean
    },
    data() {
        return {
            imageList: [],
        }
    },
    mounted() {
        for (const item of this.list) {
            this.addProperties(item)
        }
    },
    methods: {
        getThumb,
        init(list) {
            for (const item of (list || this.list)) {
                this.addProperties(item)
            }
        },
        previewImage(item) {
            if (['mp4', 'mov'].some(i => item.src.toLowerCase().includes(i))) {
                this.$Router.push({ name: 'videoPreview', query: { src: item.src }})
            } else {
                const current = this.imageList.map(i => i.src).filter(i => !['mp4', 'mov'].some(j => i.toLowerCase().includes(j))).findIndex(v => v === item.src)
                uni.previewImage({
                    urls: this.imageList.map(i => i.src).filter(i => !['mp4', 'mov'].some(j => i.toLowerCase().includes(j))),
                    current,
                })
            }
        },
        addImages() {
            if (this.custom) {
                this.$emit('addImage')
            } else {
                if (this.imageList.length < this.number) {
                    const checkNumber = this.number - this.imageList.length
                    this.$refs.photo.open(checkNumber)
                } else {
                    this.$toast({ title: '最多上传3张照片哦~' })
                }
            }
        },
        addProperties(item) {
            this.imageList.push({
                src: item,
            })
            this.$emit('update:list', this.imageList.map(i => i.src))
            this.$emit('change', this.imageList.map(i => i.src))
        },
        sourceSubmit(photo) {
            if (Array.isArray(photo)) {
                photo.forEach(i => {
                    this.addProperties(i)
                })
            } else {
                this.addProperties(photo)
            }
        },
        delImage(item, index) {
            this.imageList.splice(index, 1)
            this.$emit('update:list', this.imageList.map(i => i.src))
            this.$emit('change', this.imageList.map(i => i.src))
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-upload-mulit-image {
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    position: relative;
    flex-wrap: wrap;
    &-add{
        width: 120rpx;
        height: 120rpx;
        border-radius: 8rpx;
        opacity: 0.5;
        border: 1rpx solid #CCCCCF;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 24rpx;
        margin-bottom: 16rpx;
        &-icon{
            width: 48rpx;
            height: 48rpx;
        }
        &-title{
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.5);
            line-height: 34rpx;
        }
        &-subtitle{
            font-size: 20rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.3);
            line-height: 28rpx;
        }
    }
    &-item{
        margin-right: 24rpx;
        position:relative;
        margin-bottom: 16rpx;
        .pre-image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
            overflow: hidden;
            .pre-image-video{
                position:relative;
                width: 100%;
                height: 100%;
                .pre-image-play{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    width: 72rpx;
                    height: 72rpx;
                }
            }
        }
        &-clear{
            position: absolute;
            right: 0rpx;
            top:-24rpx;
            width:24rpx;
            height: 24rpx;
            color:000;
            opacity: 0.5;
        }
    }
}
</style>
