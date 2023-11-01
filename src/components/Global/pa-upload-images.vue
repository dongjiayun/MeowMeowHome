<template>
    <view class="pa-upload-mulit-image">
        <movable-area class="area" :style="{ height: areaHeight }" @mouseenter="mouseenter" @mouseleave="mouseleave">
            <block v-for="(item, index) in imageList" :key="item.id">
                <movable-view
                    class="view"
                    :x="item.x"
                    :y="item.y"
                    direction="all"
                    :damping="40"
                    :disabled="item.disable || readonly"
                    :style="{ width: viewWidth + 'px', height: viewWidth + 'px', opacity: item.opacity }"
                    @change="onChange($event, item)"
                    @touchstart="touchstart(item)"
                    @mousedown="touchstart(item)"
                    @touchend="touchend(item)"
                    @mouseup="touchend(item)"
                >
                    <view
                        class="area-con"
                        :style="{ width: childWidth, height: childWidth, transform: 'scale(' + item.scale + ')' }"
                        @click="previewImage(item)"
                    >
                        <view class="pre-image">
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
                            class="pa-upload-mulit-image-clear"
                            :size="24"
                            type="clear"
                            @click="delImage(item, index)"
                        />
                    </view>
                </movable-view>
            </block>
            <view
                v-if="!readonly"
                class="pa-upload-mulit-image-add"
                :style="{ top: add.y, left: add.x, width: viewWidth + 'px', height: viewWidth + 'px' }"
                @click="addImages"
            >
                <image class="pa-upload-mulit-image-add-icon" :src="require('@/static/global/camera.png')" />
                <view class="pa-upload-mulit-image-add-title">{{ title }}</view>
                <view class="pa-upload-mulit-image-add-subtitle">最多{{ number }}张</view>
            </view>
        </movable-area>
        <pa-photo-picker ref="photo" :extension="extension" :type="type" :count="number - imageList.length" @choose="sourceSubmit" />
    </view>
</template>

<script>
import { getThumb } from '@/utils/obs'

export default {
    props: {
        // 返回排序后图片
        list: {
            type: Array,
            default: function() {
                return []
            }
        },
        // 选择图片数量限制
        number: {
            type: Number,
            default: 6
        },
        // 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
        imageWidth: {
            type: Number,
            default: 144
        },
        // 图片列数（cols > 0 则 imageWidth 无效）
        cols: {
            type: Number,
            default: 0
        },
        // 图片周围空白填充，单位 rpx
        padding: {
            type: Number,
            default: 10
        },
        // 拖动图片时放大倍数 [0, ∞)
        scale: {
            type: Number,
            default: 1.1
        },
        // 拖动图片时不透明度
        opacity: {
            type: Number,
            default: 0.7
        },
        // 自定义添加（需配合 @aaddImage 事件使用）
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
            width: 0,
            add: {
                x: 0,
                y: 0
            },
            colsValue: 0,
            viewWidth: 0,
            tempItem: null,
            timer: null,
            changeStatus: true,
            preStatus: true,
        }
    },
    computed: {
        areaHeight() {
            if (this.imageList.length < this.number) {
                return Math.ceil((this.imageList.length + 1) / this.colsValue) * this.viewWidth + 'px'
            } else {
                return Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
            }
        },
        childWidth() {
            return this.viewWidth - this.rpx2px(this.padding) * 2 + 'px'
        },
    },
    created() {
        this.width = uni.getSystemInfoSync().windowWidth
        this.viewWidth = this.rpx2px(this.imageWidth)
    },
    mounted() {
        const query = uni.createSelectorQuery().in(this)
        query.select('.area').boundingClientRect(data => {
            this.colsValue = Math.floor(data.width / this.viewWidth)
            if (this.cols > 0) {
                this.colsValue = this.cols
                this.viewWidth = data.width / this.cols
            }
            for (const item of this.list) {
                this.addProperties(item)
            }
        })
        query.exec()
    },
    methods: {
        getThumb,
        onChange(e, item) {
            if (!item) return
            item.oldX = e.detail.x
            item.oldY = e.detail.y
            if (e.detail.source === 'touch') {
                if (item.moveEnd) {
                    item.offset = Math.sqrt(Math.pow(item.oldX - item.absX * this.viewWidth, 2) + Math.pow(item.oldY - item.absY * this.viewWidth, 2))
                }
                const x = Math.floor((e.detail.x + this.viewWidth / 2) / this.viewWidth)
                if (x >= this.colsValue) return
                const y = Math.floor((e.detail.y + this.viewWidth / 2) / this.viewWidth)
                const index = this.colsValue * y + x
                if (item.index !== index && index < this.imageList.length) {
                    this.changeStatus = false
                    for (const obj of this.imageList) {
                        if (item.index > index && obj.index >= index && obj.index < item.index) {
                            this.change(obj, 1)
                        } else if (item.index < index && obj.index <= index && obj.index > item.index) {
                            this.change(obj, -1)
                        } else if (obj.id !== item.id) {
                            obj.offset = 0
                            obj.x = obj.oldX
                            obj.y = obj.oldY
                            setTimeout(() => {
                                this.$nextTick(() => {
                                    obj.x = obj.absX * this.viewWidth
                                    obj.y = obj.absY * this.viewWidth
                                })
                            }, 0)
                        }
                    }
                    item.index = index
                    item.absX = x
                    item.absY = y
                    this.sortList()
                }
            }
        },
        change(obj, i) {
            obj.index += i
            obj.offset = 0
            obj.x = obj.oldX
            obj.y = obj.oldY
            obj.absX = obj.index % this.colsValue
            obj.absY = Math.floor(obj.index / this.colsValue)
            setTimeout(() => {
                this.$nextTick(() => {
                    obj.x = obj.absX * this.viewWidth
                    obj.y = obj.absY * this.viewWidth
                })
            }, 0)
        },
        touchstart(item) {
            this.imageList.forEach(v => {
                v.zIndex = v.index + 9
            })
            item.zIndex = 99
            item.moveEnd = true
            this.tempItem = item
            this.timer = setTimeout(() => {
                item.scale = this.scale
                item.opacity = this.opacity
                clearTimeout(this.timer)
                this.timer = null
            }, 0)
        },
        touchend(item) {
            item.scale = 1
            item.opacity = 1
            item.x = item.oldX
            item.y = item.oldY
            item.offset = 0
            item.moveEnd = false
            setTimeout(() => {
                this.$nextTick(() => {
                    item.x = item.absX * this.viewWidth
                    item.y = item.absY * this.viewWidth
                    this.tempItem = null
                    this.changeStatus = true
                })
            }, 0)
        },
        previewImage(item) {
            clearTimeout(this.timer)
            this.timer = null
            if (['mp4', 'mov'].some(i => item.src.toLowerCase().includes(i))) {
                this.$Router.push({ name: 'videoPreview', query: { src: item.src }})
            } else {
                const src = this.list.filter(i => !['mp4', 'mov'].some(j => i.toLowerCase().includes(j))).findIndex(v => v === item)
                uni.previewImage({
                    urls: this.list.filter(i => !['mp4', 'mov'].some(j => i.toLowerCase().includes(j))),
                    current: src,
                    success: () => {
                        this.preStatus = false
                        setTimeout(() => {
                            this.preStatus = true
                        }, 600)
                    }
                })
            }
        },
        mouseenter() {
            // #ifdef H5
            this.imageList.forEach(v => {
                v.disable = false
            })
            // #endif
        },
        mouseleave() {
            // #ifdef H5
            if (this.tempItem) {
                this.imageList.forEach(v => {
                    v.disable = true
                    v.zIndex = v.index + 9
                    v.offset = 0
                    v.moveEnd = false
                    if (v.id === this.tempItem.id) {
                        if (this.timer) {
                            clearTimeout(this.timer)
                            this.timer = null
                        }
                        v.scale = 1
                        v.opacity = 1
                        v.x = v.oldX
                        v.y = v.oldY
                        this.$nextTick(() => {
                            v.x = v.absX * this.viewWidth
                            v.y = v.absY * this.viewWidth
                            this.tempItem = null
                        })
                    }
                })
                this.changeStatus = true
            }
            // #endif
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
        addImage(image) {
            this.addProperties(image)
        },
        delImage(item, index) {
            this.imageList.splice(index, 1)
            for (const obj of this.imageList) {
                if (obj.index > item.index) {
                    obj.index -= 1
                    obj.x = obj.oldX
                    obj.y = obj.oldY
                    obj.absX = obj.index % this.colsValue
                    obj.absY = Math.floor(obj.index / this.colsValue)
                    this.$nextTick(() => {
                        obj.x = obj.absX * this.viewWidth
                        obj.y = obj.absY * this.viewWidth
                    })
                }
            }
            this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
            this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
            this.sortList()
        },
        sortList() {
            const list = this.imageList.slice()
            list.sort((a, b) => {
                return a.index - b.index
            })
            for (let i = 0; i < list.length; i++) {
                list[i] = list[i].src
            }
            this.$emit('update:list', list)
        },
        addProperties(item) {
            const absX = this.imageList.length % this.colsValue
            const absY = Math.floor(this.imageList.length / this.colsValue)
            const x = absX * this.viewWidth
            const y = absY * this.viewWidth
            this.imageList.push({
                src: item,
                x,
                y,
                oldX: x,
                oldY: y,
                absX,
                absY,
                scale: 1,
                zIndex: 9,
                opacity: 1,
                index: this.imageList.length,
                id: this.guid(),
                disable: false,
                offset: 0,
                moveEnd: false
            })
            this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
            this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
            this.sortList()
        },
        nothing() {},
        rpx2px(v) {
            return this.width * v / 750
        },
        guid() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
            }
            return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
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
    }
}
</script>

<style lang="scss" scoped>
.pa-upload-mulit-image {
    padding:  30rpx 0;
    &-add{
        width: 144rpx;
        height: 144rpx;
        border-radius: 8rpx;
        opacity: 0.5;
        border: 1rpx solid #CCCCCF;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 24rpx;
        position: absolute;
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
    &-clear{
        position: absolute;
        right: 0rpx;
        top:-24rpx;
        width:24rpx;
        height: 24rpx;
        color:000;
        opacity: 0.8;
    }
    .area {
        width: 100%;
        .view {
            display: flex;
            justify-content: center;
            align-items: center;
            .area-con {
                position: relative;
                .pre-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 12rpx;
                    overflow: hidden;
                    .pre-image-video{
                        position:relative;
                        width: 100%;
                        height: 100%;
                        .pre-image-play{
                            position: absolute;
                            z-index:100;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            width: 72rpx;
                            height: 72rpx;
                        }
                    }
                }
                .del-con {
                    position: absolute;
                    top: -12rpx;
                    right: -12rpx;
                    padding: 0 0 20rpx 20rpx;
                    .del-wrap {
                        width: 36rpx;
                        height: 36rpx;
                        background: #BBBBBB;
                        border-radius:36rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .cover-word{
                    left: 16rpx;
                    position: absolute;
                    bottom: 16rpx;
                    width: 72rpx;
                    background: #333333;
                    color: #FFFFFF;
                    font-size: 20rpx;
                    height: 30rpx;
                    line-height: 30rpx;
                    text-align: center;
                    border-radius: 15rpx;
                }
            }
        }
        .add {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            .add-wrap{
                border-radius: 12rpx;
                border: 1rpx solid #E5E5E5;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 144rpx;
                height: 144rpx;
                position: relative;
            }
        }
    }
}
</style>
