<template>
    <view class="uni-numbox pa-numbox" :class="{ small }">
        <view class="uni-numbox__minus uni-numbox-btns" :style="{ background }" @click.stop="_calcValue('minus')">
            <view
                class="uni-numbox--text"
                :class="{ 'uni-numbox--disabled': inputValue <= min || disabled }"
            >-</view>
        </view>
        <input
            v-model="inputValue"
            :disabled="disabled"
            class="uni-numbox__value"
            type="number"
            :style="{ background, color }"
            @focus="_onFocus"
            @blur="_onBlur"
            @click.stop="() => {}"
        />
        <view class="uni-numbox__plus uni-numbox-btns" :style="{ background }" @click.stop="_calcValue('plus')">
            <view
                class="uni-numbox--text"
                :class="{ 'uni-numbox--disabled': inputValue >= max || disabled }"
            >+</view>
        </view>
    </view>
</template>
<script>
/**
	 * NumberBox 数字输入框
	 * @description 带加减按钮的数字输入框
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=31
	 * @property {Number} value 输入框当前值
	 * @property {Number} min 最小值
	 * @property {Number} max 最大值
	 * @property {Number} step 每次点击改变的间隔大小
	 * @property {String} background 背景色
	 * @property {String} color 字体颜色（前景色）
	 * @property {Boolean} disabled = [true|false] 是否为禁用状态
	 * @event {Function} change 输入框值改变时触发的事件，参数为输入框当前的 value
	 * @event {Function} focus 输入框聚焦时触发的事件，参数为 event 对象
	 * @event {Function} blur 输入框失焦时触发的事件，参数为 event 对象
	 */

export default {
    name: 'UniNumberBox',
    props: {
        value: {
            type: [Number, String],
            default: 1
        },
        modelValue: {
            type: [Number, String],
            default: 1
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 99
        },
        step: {
            type: Number,
            default: 1
        },
        background: {
            type: String,
            default: '#F5F5F5'
        },
        color: {
            type: String,
            default: '#181818'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isSku: Boolean,
        small: Boolean,
        limitType: String
    },
    emits: ['change', 'input', 'update:modelValue', 'blur', 'focus'],
    data() {
        return {
            inputValue: 0
        }
    },
    watch: {
        value(val) {
            this.inputValue = +val
        },
        modelValue(val) {
            this.inputValue = +val
        }
    },
    created() {
        if (this.value === 1) {
            this.inputValue = +this.modelValue
        }
        if (this.modelValue === 1) {
            this.inputValue = +this.value
        }
    },
    methods: {
        toastLimit() {
            if (this.limitType) {
                switch (this.limitType) {
                    case 'order':
                        this.$toast({ title: `该商品每单限购${this.max}件` })
                        break
                    case 'user':
                        this.$toast({ title: `该商品每人限购${this.max}件` })
                        break
                }
            } else {
                this.$toast({ title: `加购数量不能超过${this.max}件` })
            }
        },
        _calcValue(type) {
            if (this.disabled) {
                return
            }
            const scale = this._getDecimalScale()
            let value = this.inputValue * scale
            const step = this.step * scale
            if (type === 'minus') {
                value -= step
                if (value < (this.min * scale)) {
                    if (this.isSku) this.$toast({ title: '最少购买一件哦' })
                    return
                }
                if (value > (this.max * scale)) {
                    value = this.max * scale
                }
            }

            if (type === 'plus') {
                value += step
                if (value > (this.max * scale)) {
                    if (this.isSku) {
                        this.toastLimit()
                    }
                    return
                }
                if (value < (this.min * scale)) {
                    value = this.min * scale
                }
            }

            this.inputValue = (value / scale).toFixed(String(scale).length - 1)
            this.$emit('change', +this.inputValue)
            // TODO vue2 兼容
            this.$emit('input', +this.inputValue)
            // TODO vue3 兼容
            this.$emit('update:modelValue', +this.inputValue)
        },
        _getDecimalScale() {
            let scale = 1
            // 浮点型
            if (~~this.step !== this.step) {
                scale = Math.pow(10, String(this.step).split('.')[1].length)
            }
            return scale
        },
        _onBlur(event) {
            this.$emit('blur', event)
            let value = event.detail.value
            if (isNaN(value)) {
                this.inputValue = this.min
                if (this.isSku) this.$toast({ title: '加购数量必须为数字' })
                return
            }
            value = +value
            if (value > this.max) {
                value = this.max
                if (this.isSku) this.toastLimit()
            } else if (value < this.min) {
                value = this.min
                if (this.isSku) this.$toast({ title: '最少购买一件哦' })
            }
            const scale = this._getDecimalScale()
            this.inputValue = value.toFixed(String(scale).length - 1)
            this.$emit('change', +this.inputValue)
            this.$emit('input', +this.inputValue)
            this.$emit('update:modelValue', +this.inputValue)
        },
        _onFocus(event) {
            this.$emit('focus', event)
        }
    }
}
</script>
<style lang="scss" >
    $box-height: 64rpx;
    $bg: #F5F5F5;
    $br: 12rpx;
    $color: #999999;
    .pa-numbox{
        &.small{
            .uni-numbox-btns{
                width: 56rpx;
                height: 56rpx;
            }
            .uni-numbox__value{
                width: 72rpx;
                height: 56rpx;
            }
            .uni-numbox--text{
                font-size: 36rpx;
            }
        }
        &.uni-numbox {
            display: flex;
            flex-direction: row;
        }
        .uni-numbox-btns {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background-color: $bg;
            cursor: pointer;
            width: $box-height;
            height: $box-height;
        }

        .uni-numbox__value {
            margin: 0 2px;
            background-color: $bg;
            width: 40px;
            height: $box-height;
            text-align: center;
            font-size: 14px;
            border-left-width: 0;
            border-right-width: 0;
            color: $color;
        }

        .uni-numbox__minus {
            border-top-left-radius: $br;
            border-bottom-left-radius: $br;
        }

        .uni-numbox__plus {
            border-top-right-radius: $br;
            border-bottom-right-radius: $br;
        }

        .uni-numbox--text {
            font-size: 48rpx;
            color: $color;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bolder;
            position: relative;
            top:-4rpx;
            &.uni-numbox--disabled{
                color:#E2E2E2 !important;
                cursor: not-allowed;
            }
        }
    }
</style>
