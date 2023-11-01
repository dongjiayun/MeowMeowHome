<template>
    <view class="pa-uni-search">
        <view
            v-for="(item,index) in forms"
            :key="index"
            class="pa-uni-search-item"
        >
            <view v-if="item.label && showLabelType.includes(item.type)" class="pa-uni-search-item-label">{{ item.label }}</view>
            <pa-tags
                v-if="item.type === 'select'"
                :value="getValueByProp(item.prop)"
                :opts="item.opts"
                :muliple="item.muliple"
                :prop="item.prop"
                @change="handleChange"
            />
            <pa-range-slider
                v-if="item.type === 'range-slider'"
                :width="670"
                :height="item.height"
                :min="item.min"
                :max="item.max"
                :values.sync="item.values"
                :step="item.step"
                :live-mode="item.liveMode"
                :unit="item.unit"
                :min-text="item.minText"
                :max-text="item.maxText"
            />
            <view
                v-if="item.type === 'number-box'"
                class="pa-uni-search-item-number"
                :class="{ normalMarginBottom }"
            >
                <view class="pa-uni-search-item-number-info">
                    <view class="pa-uni-search-item-number-info-title">{{ item.label }}</view>
                    <view
                        v-if="!isNullOrEmpty(item.redeemNumberOnce)"
                        class="pa-uni-search-item-number-info-red-limit"
                    >
                        <text>活动限购{{ item.redeemNumberOnce }}件</text>
                    </view>
                    <template v-else>
                        <view
                            v-if="!isNullOrEmpty(item.limitPerOrder)"
                            class="pa-uni-search-item-number-info-red-limit"
                        >
                            <text>每单限购{{ item.limitPerOrder }}件</text>
                        </view>
                        <view
                            v-if="!isNullOrEmpty(item.limitPerUser)"
                            class="pa-uni-search-item-number-info-red-limit"
                        >
                            <text>每人限购{{ item.limitPerUser }}件</text>
                        </view>
                    </template>
                    <view style="flex:1" />
                    <view class="pa-uni-search-item-number-info-number">
                        <custom-number-box
                            :value="getValueByProp(item.prop)"
                            :min="1"
                            :max="item.max || 99"
                            :is-sku="item.isSku"
                            :limit-type="item.limitType"
                            @blur="item.blur ? item.blur : () => {}"
                            @change="handleChange($event,item.prop)"
                        />
                        <view v-if="item.subtitle" class="pa-uni-search-item-number-info-number-subtitle" :style="item.subtitleStyle">{{ item.subtitle || '' }}</view>
                    </view>
                </view>
            </view>
            <view
                v-if="item.type === 'combined-goods'"
                class="pa-uni-search-item-combined-goods"
            >
                <view
                    v-for="(i,inx) in item.opts"
                    :key="inx"
                    class="pa-uni-search-item-combined-goods-item"
                    :class="{
                        active: form[item.prop] === i.value,
                        disabled: i.disabled
                    }"
                    @click="handleChange(i.value,item.prop)"
                >
                    <view class="pa-uni-search-item-combined-goods-item-label">{{ i.label }}</view>
                    <view class="pa-uni-search-item-combined-goods-item-price">¥{{ toThousandsNumByPenny(i.price) }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { toThousandsNumByPenny, isNullOrEmpty } from '@/utils'
import customNumberBox from '../custom-number-box'

export default {
    name: 'PaUniSearch',
    components: { customNumberBox },
    props: {
        forms: {
            type: Array,
            default: () => []
        },
        normalMarginBottom: Boolean
    },
    data() {
        return {
            form: {},
            showLabelType: ['select', 'range-slider', 'combined-goods']
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        toThousandsNumByPenny,
        isNullOrEmpty,
        init(obj) {
            const forms = this.forms
            const form = {}
            forms?.forEach(i => {
                if (i.type === 'select') {
                    if (i.muliple) {
                        form[i.prop] = []
                    } else {
                        form[i.prop] = undefined
                    }
                } else if (i.type === 'range-slider') {
                    form[i.prop] = []
                } else if (i.type === 'number-box') {
                    form[i.prop] = 0
                } else {
                    form[i.prop] = ''
                }
            })
            this.form = { ...form, ...obj }
            this.$emit('change', this.form)
        },
        setFormByProp(key, value) {
            this.handleChange(value, key)
        },
        // 小程序不支持 :foo="form[prop]" 传参,故使用此折中方法
        getValueByProp(prop) {
            return this.form[prop]
        },
        handleChange(value, prop) {
            this.$set(this.form, prop, value)
            this.$emit('change', this.form, prop, value)
        },
        checkSmallSize(item) {
            return !isNullOrEmpty(item.limitPerOrder) && !isNullOrEmpty(item.limitPerUser) && !isNullOrEmpty(item.redeemNumberOnce)
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-uni-search{
    &-item{
        margin-bottom: 48rpx;
        &-label{
            font-size: 28rpx;
            font-weight: 500;
            color: #333336;
            line-height: 40rpx;
            margin-bottom: 16rpx;
        }
        &-number{
            margin-bottom: 84rpx;
            &.normalMarginBottom{
                margin-bottom: 48rpx;
            }
            display: flex;
            justify-content: space-between;
            &-info{
                display: flex;
                align-items: baseline;
                flex:1;
                &-title{
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #332C22;
                    line-height: 40rpx;
                    margin-right: 24rpx;
                    white-space: nowrap;
                }
                &-subtitle{
                    font-size: 24rpx;
                    font-weight: 400;
                    color: rgba(0,0,0,0.3);
                    line-height: 32rpx;
                    margin-right: 24rpx;
                }
                &-red-limit{
                    font-size: 24rpx;
                    font-weight: 400;
                    color: #F45731;
                    line-height: 32rpx;
                    margin-right: 16rpx;
                    white-space: nowrap;
                    &.smallSize{
                        font-size: 20rpx;
                    }
                }
                &-number{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    &-subtitle{
                        margin-top: 8rpx;
                        font-size: 24rpx;
                        font-weight: 400;
                        color: rgba(0,0,0,0.3);
                        line-height: 32rpx;
                        margin-left: 16rpx;
                    }
                }
            }
        }
        &-combined-goods{
            &-item{
                background: #F5F5F5;
                border-radius: 64rpx;
                padding:12rpx 32rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                &-label{
                    font-size: 28rpx;
                    font-weight: 400;
                    color: #332C22;
                    line-height: 40rpx;
                }
                &-price{
                    color: rgba(0,0,0,0.5);
                }
                &.active{
                    background: #FFEDDE;
                    .pa-uni-search-item-combined-goods-item-label,.pa-uni-search-item-combined-goods-item-price{
                        font-weight: 500;
                        color: #F28900;
                    }
                }
                &.disabled{
                    .pa-uni-search-item-combined-goods-item-label,.pa-uni-search-item-combined-goods-item-price{
                        color: rgba(0,0,0,0.3);
                    }
                }
            }
            &-item{
                margin-bottom: 16rpx;
            }
        }
    }
}
</style>
