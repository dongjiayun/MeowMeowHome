<template>
    <view class="pa-form">
        <view class="pa-form-main" :class="{ noPadding }">
            <uni-forms
                ref="form"
                :model-value="form"
            >
                <view
                    v-for="(item,index) in Forms"
                    :key="index"
                    :class="{ aftersale: item.type === 'aftersaleRefundPrice' }"
                >
                    <forms-item
                        :name="item.prop"
                        :label="item.label"
                        :label-color="item.labelColor || 'rgba(0,0,0,0.5)'"
                        :label-font-size="item.labelFontSize"
                        :label-width="item.labelWidth ? item.labelWidth : item.label ? 100 : 0"
                        :item-height="item.itemHeight"
                        :align-top="item.type === 'input' && item.inputType === 'textarea'"
                        :align-right="item.alignRight"
                        :division="hasDivision && index !== Forms.length - 1"
                    >
                        <view class="pa-form-main-item">
                            <view
                                v-if="item.type === 'input'"
                                class="pa-form-main-item-input"
                                :style="{ alignItems: item.inputType === 'textarea' ? undefined : 'center' }"
                            >
                                <easyinput
                                    :type="item.inputType"
                                    :placeholder="item.placeholder"
                                    :maxlength="item.maxlength || 999"
                                    :value="getFormValue(item.prop)"
                                    auto-height
                                    :adjust-position="item.adjustPosition"
                                    :focus="currentFocus === item.prop"
                                    @input="handleInputChange($event,item.prop)"
                                    @focus="handleInputFocus(item.prop)"
                                    @blur="handleInputBlur"
                                    @clear="handleInputClear(item.prop)"
                                />
                                <view v-if="item.maxlength" class="pa-form-main-item-input-controllers">
                                    <view
                                        v-if="item.inputType === 'textarea' && currentFocus === item.prop"
                                        class="pa-form-main-item-input-controllers-clear"
                                        @click="handleInputClear(item.prop)"
                                    >
                                        <uni-icons
                                            v-if="getFormValueLength(item.prop) > 0"
                                            color="#c0c4cc"
                                            type="clear"
                                            size="26"
                                        />
                                    </view>
                                    <view v-else class="pa-form-main-item-input-controllers-clear" />
                                    <view class="pa-form-main-item-input-controllers-wordlimit" :class="{ limit: getFormValueLength(item.prop,item.maxlength) === item.maxlength }">{{ getFormValueLength(item.prop,item.maxlength) }}/{{ item.maxlength }}</view>
                                </view>
                            </view>
                            <view v-if="item.type === 'custom-select'" class="pa-form-main-item-input">
                                <easyinput
                                    readonly
                                    :clearable="!item.hideClear"
                                    :show-right-arrow="item.showRightArrow"
                                    :text-align="item.textAlign"
                                    :placeholder="item.placeholder"
                                    :adjust-position="item.adjustPosition"
                                    :value="getFormValue(`_${item.prop}`)"
                                    @clear="handleSelectClear(item)"
                                    @click.native="handleCustomSelect(item)"
                                />
                            </view>
                            <view v-if="item.type === 'select'" class="pa-form-main-item-input">
                                <easyinput
                                    readonly
                                    :clearable="!item.hideClear"
                                    :show-right-arrow="item.showRightArrow"
                                    :text-align="item.textAlign"
                                    :placeholder="item.placeholder"
                                    :adjust-position="item.adjustPosition"
                                    :value="getFormValue(`_${item.prop}`)"
                                    @clear="handleSelectClear(item)"
                                    @click.native="handleSelect(item)"
                                />
                            </view>
                            <view v-if="item.type === 'chooser'" class="pa-form-main-item-input">
                                <easyinput
                                    readonly
                                    :clearable="!item.hideClear"
                                    :show-right-arrow="item.showRightArrow"
                                    :text-align="item.textAlign"
                                    :placeholder="item.placeholder"
                                    :adjust-position="item.adjustPosition"
                                    :value="getFormValue(`_${item.prop}`)"
                                    @clear="handleSelectClear(item)"
                                    @click.native="handleChooser(item)"
                                />
                            </view>
                            <view v-if="item.type === 'area-selector'" class="pa-form-main-item-input">
                                <easyinput
                                    readonly
                                    :placeholder="item.placeholder"
                                    :show-right-arrow="item.showRightArrow"
                                    :text-align="item.textAlign"
                                    :adjust-position="item.adjustPosition"
                                    :value="getFormValue(`_${item.prop}`)"
                                    @clear="handleSelectClear(item)"
                                    @click.native="handleAreaSelect(item)"
                                />
                            </view>
                            <view v-if="item.type === 'date-selector'" class="pa-form-main-item-input">
                                <easyinput
                                    readonly
                                    :placeholder="item.placeholder"
                                    :show-right-arrow="item.showRightArrow"
                                    :text-align="item.textAlign"
                                    :adjust-position="item.adjustPosition"
                                    :value="getFormValue(`_${item.prop}`)"
                                    @clear="handleSelectClear(item)"
                                    @click.native="handleDateSelect(item)"
                                />
                            </view>
                            <view
                                v-if="item.type === 'tags'"
                                class="pa-form-main-item-tags"
                                :style="{ justifyContent: item.align }"
                            >
                                <view
                                    v-for="(i,inx) in item.opts"
                                    :key="inx"
                                    class="pa-form-main-item-tags-item"
                                    :class="{ active: getFormValue(item.prop) === i.value }"
                                    :style="{ backgroundColor: getFormValue(item.prop) === i.value ? (item.activeColor || '#FFAA2C') : '#D7D7D7' }"
                                    @click="handleTagClick(item, i)"
                                >
                                    {{ i.label }}
                                </view>
                            </view>
                            <view
                                v-if="item.type === 'number'"
                                :class="{ alignRight: item.alignRight }"
                                class="pa-form-main-item-number"
                            >
                                <view
                                    v-if="item.showLimit && item.max"
                                    class="pa-form-main-item-number-limit"
                                >
                                    <text>(最多{{ isNullOrEmpty(item.max) ? 0 : item.max }}个)</text>
                                </view>
                                <view
                                    v-if="item.showRedLimit && item.max"
                                    class="pa-form-main-item-number-red-limit"
                                >
                                    <text>每人限购{{ isNullOrEmpty(item.max) ? 0 : item.max }}件</text>
                                </view>
                                <custom-number-box
                                    :value="getFormValue(item.prop)"
                                    :min="item.min || 0"
                                    :max="isNullOrEmpty(item.max) ? 99 : item.max"
                                    @blur="handleNumberBlur($event,item)"
                                    @change="handleNumberChange($event,item)"
                                />
                            </view>
                            <!-- 微信小程序不支持动态插槽,只能枚举嵌入各种业务场景-->
                            <!-- <slot v-if="item.slot" :name="item.slot" :item="item" :form="form" />-->
                            <!-- 创建售后单退款金额 -->
                            <view v-if="item.type === 'aftersaleRefundPrice'" class="pa-aftersale-create-body-price">
                                <view class="pa-aftersale-create-body-price-title">
                                    <view class="pa-aftersale-create-body-price-title-label">退款金额</view>
                                    <view v-if="(item.afterSaleType === 'refund' && ((form.isConfirmDelivery && form.isConfirmDelivery[0] === false) || !form.isConfirmDelivery || form.isConfirmDelivery.length === 0))" class="pa-aftersale-create-body-price-title-price">￥
                                        {{ form[item.prop] * 100 > item.maxPrice ? toThousandsNumByPenny(item.maxPrice) : toThousandsNum(form[item.prop]) }}
                                    </view>
                                    <view v-else class="pa-aftersale-create-body-price-title-price">
                                        ￥<input
                                            class="pa-aftersale-create-body-price-title-price-input"
                                            :style="{ width: aftersaleInputWidth }"
                                            :value="form.aftersaleAmount"
                                            :disabled="item.disabled"
                                            @blur="handleAftersalePrice($event,item)"
                                            @input="getAftersaleAmountWidth"
                                        />
                                    </view>
                                </view>
                                <view class="pa-aftersale-create-body-price-subtitle">{{ item.afterSaleType === 'refund' && ((form.isConfirmDelivery && form.isConfirmDelivery[0] === false) || !form.isConfirmDelivery || form.isConfirmDelivery.length === 0) || item.disabled ? '不可修改' : '可修改' }}，最多￥{{ toThousandsNumByPenny(item.maxPrice) }}，含发货运费￥{{ toThousandsNumByPenny(item.freightFee) }}</view>
                            </view>
                            <view v-if="item.type === 'smscode'" class="pa-form-main-item-smscode">
                                <easyinput
                                    :placeholder="item.placeholder || '请输入6位验证码'"
                                    :adjust-position="item.adjustPosition"
                                    :value="getFormValue(item.prop)"
                                    @input="handleInputChange($event,item.prop)"
                                    @clear="handleInputClear(item)"
                                />
                                <view
                                    v-if="smsIntervalNumbers[item.prop] > 0"
                                    class="pa-form-main-item-smscode-button disabled"
                                >
                                    重新获取({{ smsIntervalNumbers[item.prop] }})
                                </view>
                                <view
                                    v-else
                                    class="pa-form-main-item-smscode-button"
                                    @click="handleGetSmscode(item.prop)"
                                >{{ smsIntervals[item.prop] === 'ended' ? '重新获取' : '获取验证码' }}</view>
                            </view>
                            <view v-if="item.type === 'uploadImages'" class="pa-form-main-item-upload-Images">
                                <pa-upload-images
                                    :number="item.number || 1"
                                    :cols="item.cols || 4"
                                    :list="getFormValue(item.prop)"
                                    :title="item.title"
                                    :type="item.mediaType"
                                    :extension="item.extension || ['jpg','jpeg','heic','mp4','mpeg','mov','3gp','png']"
                                    @change="handleUploadImages($event,item)"
                                />
                                <view v-if="item.info" class="pa-form-main-item-upload-Images-info">
                                    {{ item.info }}
                                </view>
                            </view>
                            <view
                                v-if="item.type === 'text'"
                                class="pa-form-main-item-text"
                                :style="{ textAlign: item.alignRight ? 'right' : 'left' }"
                            >
                                {{ getFormValue(item.prop) }}
                            </view>
                        </view>
                    </forms-item>
                    <!--                    <view class="pa-form-main-divider" />-->
                    <view
                        v-if="item.subtitle"
                        class="pa-form-main-subtitle"
                    >
                        {{ item.subtitle }}
                    </view>
                </view>
            </uni-forms>
        </view>
        <view class="pa-form-subtitle">{{ subtitle }}</view>
        <pa-popup-picker
            ref="popup"
            :title="currentSelectItem.title || `选择${currentSelectItem.label}`"
            :opts="currentSelectItem.opts || []"
            @submit="handlePopupPickerSubmit"
        />
        <pa-area-selector
            ref="areaSelector"
            @submit="handleAreaSelectSubmit"
        />
        <pa-popup-chooser
            ref="chooser"
            :title="currentSelectItem.title || `选择${currentSelectItem.label}`"
            :opts="currentSelectItem.opts || []"
            @submit="handleChooserSubmit"
        />
        <pa-date-popup
            ref="dateSelector"
            :title="currentSelectItem.title || `选择${currentSelectItem.label}`"
            :start-time="currentSelectItem.startTime"
            :end-time="currentSelectItem.endTime"
            @submit="handleDateSelectSubmit"
        />
    </view>
</template>

<script>
import { isNullOrEmpty, toThousandsNum, toThousandsNumByPenny } from '@/utils'
import Easyinput from '../custom-easyinput'
import FormsItem from '../custom-forms-item'
import CustomNumberBox from '../custom-number-box'
import PaPopupChooser from './pa-popup-chooser'
import { round } from 'lodash'
import dayjs from 'dayjs'

export default {
    name: 'PaForm',
    components: { PaPopupChooser, Easyinput, FormsItem, CustomNumberBox },
    options: {
        styleIsolation: 'shared',
    },
    props: {
        forms: Array,
        subtitle: String,
        noPadding: Boolean,
        hasDivision: Boolean
    },
    data() {
        return {
            form: {},
            currentSelectItem: {
                title: ''
            },
            currentFocus: undefined,
            lockValid: false,
            isIniting: false,
            aftersaleInputWidth: '200rpx',
            smsIntervals: {},
            smsIntervalNumbers: {}
        }
    },
    computed: {
        Forms() {
            return this.forms.filter(i => !i.hidden)
        },
        rules() {
            const rules = {}
            this.Forms.filter(i => i.rules).forEach(i => {
                rules[i.prop] = { rules: i.rules.map(j => {
                    if (Object.keys(j).includes('pattern')) {
                        return {
                            ...j, pattern: new RegExp(j.pattern)
                        }
                    } else {
                        return j
                    }
                }) }
            })
            return rules
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        isNullOrEmpty,
        toThousandsNumByPenny,
        toThousandsNum,
        init(obj = {}) {
            this.isIniting = true
            this.Forms.forEach(i => {
                if (['input', 'tags'].includes(i.type)) {
                    if (isNullOrEmpty(obj[i.prop])) {
                        this.$set(this.form, i.prop, '')
                    } else {
                        this.$set(this.form, i.prop, obj[i.prop])
                    }
                } else if (['select', 'area-selector', 'custom-select', 'date-selector'].includes(i.type)) {
                    if (isNullOrEmpty(obj[i.prop])) {
                        this.$set(this.form, i.prop, [])
                        this.$set(this.form, `_${i.prop}`, '')
                    } else {
                        this.$set(this.form, i.prop, obj[i.prop])
                        this.$set(this.form, `_${i.prop}`, obj['_' + i.prop])
                    }
                } else if (['number'].includes(i.type)) {
                    if (isNullOrEmpty(obj[i.prop])) {
                        this.$set(this.form, i.prop, 1)
                    } else {
                        this.$set(this.form, i.prop, obj[i.prop])
                    }
                } else if (['aftersaleRefundPrice'].includes(i.type)) {
                    if (isNullOrEmpty(obj[i.prop])) {
                        this.$set(this.form, i.prop, +i.maxPrice)
                    } else {
                        this.$set(this.form, i.prop, obj[i.prop])
                    }
                    this.getAftersaleAmountWidth({ detail: { value: this.form[i.prop] }})
                } else if (['smscode'].includes(i.type)) {
                    if (isNullOrEmpty(obj[i.prop])) {
                        this.$set(this.form, i.prop, '')
                    } else {
                        this.$set(this.form, i.prop, obj[i.prop])
                    }
                    this.$set(this.smsIntervalNumbers, i.prop, 0)
                } else if (['uploadImages'].includes(i.type)) {
                    this.$set(this.form, i.prop, [])
                    this.$set(this.form, `_${i.prop}`, '')
                } else {
                    if (isNullOrEmpty(obj[i.prop])) {
                        this.$set(this.form, i.prop, '')
                    } else {
                        this.$set(this.form, i.prop, obj[i.prop])
                    }
                }
            })
            this.$nextTick(() => {
                this.$refs.form.setRules(this.rules)
                this.isIniting = false
                console.log(this.form)
            })
        },
        setValue(prop, value) {
            this.$set(this.form, prop, value)
        },
        getFormValue(prop) {
            return this.form[prop]
        },
        getFormValueLength(prop, max) {
            return this.form[prop]?.length ? (this.form[prop]?.length > max ? max : this.form[prop]?.length) : 0
        },
        handleInputChange(e, prop) {
            this.$set(this.form, prop, e)
            this.$emit('change', this.form)
        },
        handleInputClear(prop) {
            console.log('clear')
            this.$set(this.form, prop, '')
            this.$emit('change', this.form)
        },
        async validate() {
            await this.$refs.form.validate()
            await new Promise(resolve => {
                if (!this.lockValid) {
                    resolve()
                }
            })
            // validate返回值里没有额外的信息 比如_prop
            return this.form
        },
        handleSelect(item) {
            this.currentSelectItem = item
            if (item.beforeFunc) {
                // 微信小程序只支持传入JSON.stringify支持的对象类型  function,正则等类型不支持传入 ,所以改为抛出事件类型
                return this.$emit('beforeSelectFunc', item)
            }
            this.$nextTick(() => {
                this.$refs.popup.open(this.form[item.prop])
            })
        },
        handleCustomSelect(item) {
            this.currentSelectItem = item
            this.$emit('customSelect', item)
        },
        handleAreaSelect(item) {
            this.currentSelectItem = item
            const area = this.form[item.prop]
            console.log('handleAreaSelect', area)
            this.$nextTick(() => {
                this.$refs.areaSelector.open(area)
            })
        },
        handleDateSelect(item) {
            this.currentSelectItem = item
            const date = this.form[item.prop]
            const hasDate = date && date.length > 0
            this.$nextTick(() => {
                this.$refs.dateSelector.open(hasDate ? date : dayjs().format('YYYY-MM-DD'))
            })
        },
        handlePopupPickerSubmit(value, label) {
            this.$set(this.form, `_${this.currentSelectItem.prop}`, label ? label?.join(' ') : '')
            this.$set(this.form, this.currentSelectItem.prop, value)
            const item = this.currentSelectItem
            if (item.afterFunc) {
                this.$emit('afterSelectFunc', item)
            }
            this.$emit('change', this.form)
        },
        handleSelectClear(item) {
            this.currentSelectItem = item
            this.$set(this.form, `_${this.currentSelectItem.prop}`, '')
            this.$set(this.form, this.currentSelectItem.prop, [])
            this.$emit('change', this.form)
        },
        handleAreaSelectSubmit(value, label) {
            this.$set(this.form, `_${this.currentSelectItem.prop}`, label.join(' '))
            this.$set(this.form, this.currentSelectItem.prop, value)
            this.$emit('change', this.form)
        },
        handleDateSelectSubmit(date) {
            this.$set(this.form, `_${this.currentSelectItem.prop}`, dayjs(date).format('YYYY.MM.DD'))
            this.$set(this.form, this.currentSelectItem.prop, date)
            this.$emit('change', this.form)
        },
        openSelectPopup(item) {
            this.currentSelectItem = item
            this.$refs.popup.open(this.form[item.prop])
        },
        handleNumberChange(num, item) {
            this.$set(this.form, item.prop, num)
            this.$emit('numberChange', item, num)
            this.$emit('change', this.form)
        },
        handleNumberBlur(e, item) {
            let value = +e?.detail.value
            if (isNaN(value)) {
                this.$toast({ title: `${item.label}必须为数字` })
                value = item.min || 0
            } else {
                if (item.max && value > item.max) {
                    this.$toast({ title: `${item.label}最多为${item.max}` })
                    value = item.max
                }
                if (item.min && value < item.min) {
                    this.$toast({ title: `${item.label}最少为${item.min}` })
                    value = item.min
                }
            }
            this.$set(this.form, item.prop, value)
            this.$emit('numberChange', item, value)
            this.$emit('change', this.form)
        },
        handleAftersalePrice({ detail }, item) {
            let value = +detail.value
            let valided = true
            const hasRefund = item.maxPrice > 0
            if (hasRefund) {
                if (isNaN(value)) {
                    this.$toast({ title: `退款金额必须为数字` })
                    value = item.maxPrice / 100
                    valided = false
                } else {
                    if (item.maxPrice && value > round(item.maxPrice / 100, 2)) {
                        this.$toast({ title: `退款金额最多为${round(item.maxPrice / 100, 2)}元` })
                        value = round(item.maxPrice / 100, 2)
                        valided = false
                    }
                    if (value <= 0) {
                        this.$toast({ title: `退款金额最少为0.01元` })
                        value = 0.01
                        valided = false
                    }
                }
            }
            this.form[item.prop] = ''
            if (!valided) {
                this.lockValid = true
                setTimeout(() => {
                    this.lockValid = false
                }, 300)
            }
            this.$nextTick(() => {
                this.$set(this.form, item.prop, value)
                this.getAftersaleAmountWidth({ detail: { value }})
            })
            this.$emit('change', this.form)
        },
        handleInputFocus(prop) {
            this.currentFocus = prop
        },
        handleChooser(item) {
            this.currentSelectItem = item
            this.$refs.chooser.open(this.form[item.prop])
        },
        handleChooserSubmit(value, { label }) {
            this.$set(this.form, `_${this.currentSelectItem.prop}`, label)
            this.$set(this.form, this.currentSelectItem.prop, value)
            const item = this.currentSelectItem
            if (item.afterFunc) {
                this.$emit('afterChooserFunc', item)
            }
            this.$emit('change', this.form)
        },
        handleInputBlur() {
            this.currentFocus = undefined
        },
        getAftersaleAmountWidth({ detail }) {
            const length = String(detail.value).length
            const width = length > 3 ? (length < 20 ? length * 20 + 'rpx' : 400 + 'rpx') : '72rpx'
            this.aftersaleInputWidth = width
        },
        startSmsInterval(prop) {
            this.$set(this.smsIntervalNumbers, prop, 60)
            const interval = setInterval(() => {
                if (this.smsIntervalNumbers[prop] > 0) {
                    this.$set(this.smsIntervalNumbers, prop, this.smsIntervalNumbers[prop] - 1)
                } else {
                    clearInterval(this.smsIntervals[prop])
                    this.$set(this.smsIntervals, prop, 'ended')
                    this.$emit('smsIntervalEnd', prop)
                }
            }, 1000)
            this.$set(this.smsIntervals, prop, interval)
        },
        handleGetSmscode(prop) {
            this.$emit('getSmscode', prop)
        },
        handleTagClick(item, opt) {
            this.$set(this.form, item.prop, opt.value)
            this.$emit('change', this.form)
        },
        validateField(propArr = []) {
            return this.$refs.form.validateField(propArr)
        },
        handleUploadImages(e, item) {
            this.$set(this.form, item.prop, e)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variable";
.pa-form{
    .aftersale{
        ::v-deep.uni-forms-item{
            .uni-forms-item__error{
                top:100%
            }
        }
    }
    &-main{
        background: #FFFFFF;
        border-radius: 16rpx;
        padding:0 24rpx;
        &.noPadding{
            padding:0;
        }
        &-divider{
            border-bottom: 1rpx solid #EEEEEE;;
        }
        &-subtitle{
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.5);
            line-height: 34rpx;
            margin-top: 16rpx;
        }
        &-item{
            position: relative;
            &-input{
                display: flex;
                &-controllers{
                    display: flex;
                    flex-direction: column;
                    margin-left: 10rpx;
                    &-clear{
                        flex:1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    &-wordlimit{
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        font-size: 24rpx;
                        font-weight: 400;
                        color: rgba(0,0,0,0.3);
                        &.limit{
                            color:$pingan-color
                        }
                    }
                }
            }
            &-number{
                display: flex;
                justify-content: space-between;
                align-items: center;
                &.alignRight{
                    justify-content: flex-end;
                }
                &-limit{
                    font-size: 24rpx;
                    font-weight: 400;
                    color: rgba(0,0,0,0.3);
                    line-height: 32rpx;
                }
                &-red-limit{
                    font-size: 24rpx;
                    font-weight: 400;
                    color: #F45731;
                    line-height: 32rpx;
                }
            }
            &-smscode{
                display: flex;
                align-items: center;
                justify-content: space-between;
                &-button{
                    font-size: 30rpx;
                    font-weight: 500;
                    color: #F28900;
                    &.disabled{
                        font-weight: 400;
                        color: rgba(0,0,0,0.3);
                    }
                }
            }
            &-tags{
                display: flex;
                align-items: center;
                &-item{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding:12rpx 40rpx;
                    background: #D7D7D7;
                    border-radius: 100rpx;
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #FFFFFF;
                    &.active{
                        background: #FFAA2C;
                        color: #332C22;
                    }
                }
                &-item+&-item{
                    margin-left: 16rpx;
                }
            }
            &-upload-Images{
                &-info{
                    font-size: 26rpx;
                    font-weight: 400;
                    color: #B2B2B2;
                    line-height: 36rpx;
                }
            }
        }
        ::v-deep .uni-forms-item{
            margin: 0;
            padding:24rpx 0;
            &__label{
                display: flex;
                align-items: center;
                font-size: 30rpx;
                font-weight: 400;
                color: rgba(0,0,0,0.5);
            }
            .uni-forms-item__error{
                top:calc(100% - 16rpx)
            }
        }
        ::v-deep .uni-easyinput{
            &__content {
                border: none;
                &-input{
                    font-size: 30rpx;
                }
                .uni-input-placeholder,.uni-textarea-placeholder{
                    font-size: 30rpx;
                    font-weight: 400;
                    color: rgba(0,0,0,0.3);
                    line-height: 42rpx;
                }
                .uni-input-input,.uni-textarea-textarea{
                    font-size: 30rpx;
                    font-weight: 400;
                    color: #332C22;
                    line-height: 40rpx;
                }
                .content-clear-icon{
                    color:rgb(211,211,214) !important;
                }
                &-readonly-valuer{
                    font-size: 30rpx;
                }
            }
        }
    }
    &-subtitle{
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(0,0,0,0.5);
        line-height: 34rpx;
        margin-top: 16rpx;
    }
    .pa-aftersale-create-body-price{
        &-title{
            display: flex;
            justify-content: space-between;
            margin-bottom: 4rpx;
            &-label{
                font-size: 28rpx;
                font-weight: 400;
                color: #332C22;
                line-height: 40rpx;
            }
            &-price{
                font-size: 32rpx;
                font-weight: 500;
                color: #F45731;
                line-height: 40rpx;
                display: flex;
                align-items: center;
                &-input{
                    width: 200rpx;
                    text-align: right;
                }
            }
        }
        &-subtitle{
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.3);
            line-height: 32rpx;
        }
    }
}
</style>

