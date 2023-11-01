<template>
    <view class="range-slider" :style="'width:' + width + 'rpx;height:' + height + 'rpx'">
        <view class="range-bar" :style="'width:100%;height:' + barHeight + 'rpx'">
            <view class="range-bar-bg" :style="'background-color:' + backgroundColor + ''" />
            <view class="range-bar-progress" :style="'margin-left:' + progressBarLeft + 'rpx;width:' + progressBarWidth + 'rpx;background-color:' + activeColor + ''" />
        </view>

        <view
            class="block"
            :class="{ active: isMinActive }"
            :style="'width:' + blockSize + 'rpx;height:' + blockSize + 'rpx;margin-left:' + minBlockLeft + 'rpx;'"
            :data-left="minBlockLeft"
            data-tag="minBlock"
            @touchstart="_onBlockTouchStart"
            @touchmove.stop="_onBlockTouchMove"
            @touchend="_onBlockTouchEnd"
        >
            <slot name="minBlock">
                <view
                    class="scaleplate"
                    :style="{
                        width: 2 * blockSize + 'rpx',
                        transform: `translateX(-${blockSize / 2}rpx)`
                    }"
                >
                    <text v-if="minValue === min && minText">{{ minText }}</text>
                    <template v-else>
                        <text>{{ minValue }}</text>
                        <text v-if="unit" style="margin-left: 10rpx">{{ unit }}</text>
                    </template>
                </view>
            </slot>
        </view>
        <view
            class="block"
            :class="{ active: isMaxActive }"
            :style="'width:' + blockSize + 'rpx;height:' + blockSize + 'rpx;margin-left:' + maxBlockLeft + 'rpx;'"
            :data-left="maxBlockLeft"
            data-tag="maxBlock"
            @touchstart="_onBlockTouchStart"
            @touchmove.stop="_onBlockTouchMove"
            @touchend="_onBlockTouchEnd"
        >
            <slot name="maxBlock">
                <view
                    class="scaleplate"
                    :style="{
                        width: 2 * blockSize + 'rpx',
                        transform: `translateX(-${blockSize / 2}rpx)`
                    }"
                >
                    <text v-if="maxValue === max && maxText">{{ maxText }}</text>
                    <template v-else>
                        <text>{{ maxValue }}</text>
                        <text v-if="unit" style="margin-left: 10rpx">{{ unit }}</text>
                    </template>
                </view>
            </slot>
        </view>
    </view>
</template>
<script>
/**
 * range-slider v1.0.6
 */
const _windowWidth = uni.getSystemInfoSync().windowWidth

export default {
    props: {
        // 组件宽度
        width: {
            type: Number,
            default: 750
        },
        // 组件高度
        height: {
            type: Number,
            default: 100
        },
        // 滑块大小
        blockSize: {
            type: Number,
            default: 50
        },
        // 区间进度条高度
        barHeight: {
            type: Number,
            default: 12
        },
        // 背景条颜色
        backgroundColor: {
            type: String,
            default: '#EFEFEF'
        },
        // 已选择的颜色
        activeColor: {
            type: String,
            default: '#FEC8B2'
        },
        // 最小值
        min: {
            type: Number,
            default: 0
        },
        // 最大值
        max: {
            type: Number,
            default: 100
        },
        // 设置初始值
        values: {
            type: Array,
            default: function() {
                return [0, 100]
            }
        },
        // 步长值
        step: {
            type: Number,
            default: 1
        },
        // live模式，是否动态更新
        liveMode: {
            type: Boolean,
            default: true
        },
        unit: String,
        minText: String,
        maxText: String
    },
    data() {
        return {
            isMinActive: false,
            isMaxActive: false,

            // #ifdef H5
            MAX_LENGTH: 294,
            maxBlockLeft: 300,
            // #endif

            // #ifndef H5
            MAX_LENGTH: 700,
            maxBlockLeft: 350,
            // #endif

            minBlockLeft: 0,
            progressBarLeft: 0,
            progressBarWidth: 350,

            minValue: 0,
            maxValue: 0,

            originalMinValue: 0,
            originalMaxValue: 0
        }
    },
    watch: {
        // 组件宽度
        width: function(newVal, oldVal, changedPath) {
            var that = this
            if (newVal !== that.width) {
                this._refresh()
            }
        },
        // 滑块大小
        blockSize: function(newVal, oldVal, changedPath) {
            var that = this
            if (newVal !== that.blockSize) {
                this._refresh()
            }
        },
        // 最小值
        min: function(newVal, oldVal, changedPath) {
            var that = this
            if (newVal !== that.min) {
                that._refresh()
            }
        },
        // 最大值
        max: function(newVal, oldVal, changedPath) {
            var that = this
            if (newVal !== that.max) {
                that._refresh()
            }
        },
        // 设置初始值
        values: function(newVal, oldVal, changedPath) {
            var that = this
            var values = that.values
            console.log('refresh', newVal, oldVal)
            if (that._isValuesValid(newVal) && that._isValuesValid(values)) {
                if (values[0] !== oldVal[0] || values[1] !== oldVal[1]) that._refresh()
            }
        }
    },
    created: function() {
        // 使用自定义组件编译模式时，支持生命周期为：created
        this._refresh()
        this.minValue = this.formatNumber(this.min, this.step)
        this.maxValue = this.formatNumber(this.max, this.step)
    },
    onLoad: function(option) {
        // 不使用自定义组件编译模式时，支持生命周期为：onload
        this._refresh()
    },
    onUnload: function() {},
    methods: {
        // 补0
        _pad: function(num, n) {
            return Array(n - ('' + num).length + 1).join(0) + num
        },
        _pxToRpx: function(px) {
            return (750 * px) / _windowWidth
        },
        _onBlockTouchStart: function(e) {
            const tag = e.target.dataset.tag
            if (tag === 'minBlock' || tag === 'maxBlock') {
                this.isMinActive = tag === 'minBlock'
                this.isMaxActive = tag === 'maxBlock'

                // 兼容h5平台及某版本微信
                if (e.hasOwnProperty('changedTouches')) {
                    this._blockDownX = e.changedTouches[0].pageX
                } else {
                    this._blockDownX = e.pageX
                }

                // #ifdef H5
                this._blockLeft = parseFloat(e.target.dataset.left)
                // #endif
                // #ifndef H5
                this._blockLeft = e.target.dataset.left
                // #endif

                this._curBlock = e.target.dataset.tag
            }
        },
        _onBlockTouchMove: function(e) {
            const tag = e.target.dataset.tag
            if (tag === 'minBlock' || tag === 'maxBlock') {
                var that = this
                var values = that._calculateValues(e)
                that._refreshProgressBar(values[2], values[3])
                that._refreshBlock(values[2], values[3])
                // 拖动时也触发事件
                this.originalMinValue = values[0]
                this.originalMaxValue = values[1]
                this.minValue = this.formatNumber(values[0], this.step)
                this.maxValue = this.formatNumber(values[1], this.step)
                //
                if (this.liveMode) that.$emit('update:rangechange', [this.minValue, this.maxValue])
            }
        },
        _onBlockTouchEnd: function(e) {
            const tag = e.target.dataset.tag
            this.isMinActive = false
            this.isMaxActive = false
            if (tag === 'minBlock' || tag === 'maxBlock') {
                var that = this
                var values = that._calculateValues(e.mp.changedTouches[0])
                that._refreshProgressBar(values[2], values[3])
                that._refreshBlock(values[2], values[3])
                this.originalMinValue = values[0]
                this.originalMaxValue = values[1]
                this.minValue = this.formatNumber(values[0], this.step)
                this.maxValue = this.formatNumber(values[1], this.step)
                that.$emit('update:rangechange', [this.minValue, this.maxValue])
            }
        },
        _isValuesValid: function(values) {
            return values !== null && values !== undefined && values.length === 2
        },
        /**
		 * 根据手势计算相关数据
		 */
        _calculateValues: function(e) {
            var pageX = e.pageX
            // 兼容h5平台
            if (e.hasOwnProperty('changedTouches')) {
                pageX = e.changedTouches[0].pageX
            }

            var that = this
            var moveLength = pageX - that._blockDownX
            var left = that._blockLeft + that._pxToRpx(moveLength)
            left = Math.max(0, left)
            left = Math.min(left, that.MAX_LENGTH)
            var minBlockLeft = that.minBlockLeft
            var maxBlockLeft = that.maxBlockLeft
            if (that._curBlock === 'minBlock') {
                minBlockLeft = left
            } else {
                maxBlockLeft = left
            }
            var range = that.max - that.min
            var minLeft = Math.min(minBlockLeft, maxBlockLeft)
            var maxLeft = Math.max(minBlockLeft, maxBlockLeft)
            var minValue = (minLeft / that.MAX_LENGTH) * range + that.min
            var maxValue = (maxLeft / that.MAX_LENGTH) * range + that.min
            return [minValue, maxValue, minLeft, maxLeft]
        },
        /**
		 * 计算滑块坐标
		 */
        _calculateBlockLeft: function(minValue, maxValue) {
            var that = this
            var blockSize = that.blockSize
            var range = that.max - that.min
            var minLeft = ((minValue - that.min) / range) * that.MAX_LENGTH
            var maxLeft = ((maxValue - that.min) / range) * that.MAX_LENGTH
            return [minLeft, maxLeft]
        },
        /**
		 * 刷新进度条视图
		 */
        _refreshProgressBar: function(minBlockLeft, maxBlockLeft) {
            var that = this
            var blockSize = that.blockSize
            that.progressBarLeft = minBlockLeft + blockSize / 2
            that.progressBarWidth = Math.abs(maxBlockLeft - minBlockLeft)
        },
        /**
		 * 刷新滑块视图
		 */
        _refreshBlock: function(minBlockLeft, maxBlockLeft) {
            var that = this
            that.minBlockLeft = minBlockLeft
            that.maxBlockLeft = maxBlockLeft
        },
        /**
		 * 刷新整个视图
		 */
        _refresh: function() {
            var that = this
            var MAX_LENGTH = that.width - that.blockSize
            that.MAX_LENGTH = MAX_LENGTH
            that.maxBlockLeft = MAX_LENGTH
            that.progressBarWidth = MAX_LENGTH
            var values = that.values
            if (this.originalMinValue && this.originalMinValue) {
                values = [this.originalMinValue || values[0], this.originalMaxValue || values[1]]
            }

            if (that._isValuesValid(values)) {
                values[0] = Math.max(that.min, values[0])
                values[0] = Math.min(values[0], that.max)
                values[1] = Math.max(that.min, values[1])
                values[1] = Math.min(values[1], that.max)
                var leftValues = that._calculateBlockLeft(values[0], values[1])
                that._refreshProgressBar(leftValues[0], leftValues[1])
                that._refreshBlock(leftValues[0], leftValues[1])
            }
        },
        formatNumber(num, step) {
            // 格式化数字，保留几位小数
            const stepStr = '' + step
            const index = stepStr.indexOf('.')
            const len = index > -1 ? stepStr.length - index - 1 : 0
            const offestNum = parseInt(1 + Array(('' + len).length + 1).join(0)) * 0.1
            const tmpNum = num * offestNum
            return +((parseInt(tmpNum / step + (step > 1 ? 1 : step) * 0.5) * step) / offestNum).toFixed(len)
        }
    }
}
</script>

<style lang="scss" scoped>
.range-slider {
	position: relative;
}

.range-bar {
	position: absolute;
}

.range-bar {
	position: absolute;
	top: 50%;
	transform: translate(0, -50%);
	border-radius: 10000rpx;
}

.range-bar-bg {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 10000rpx;
}

.range-bar-progress {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: blueviolet;
}

.block {
	position: absolute;
	top: 50%;
	transform: translate(0, -50%);
	border-radius: 50%;
    background: linear-gradient(180deg, #FF9367 0%, #FF7238 100%);
    box-shadow: 0px 4px 6px 0px #FFD6C5;
    .scaleplate{
        position: absolute;
        top:-44rpx;
        display: flex;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 400;
        color: #333336;
        line-height: 34rpx;
    }
}

</style>
