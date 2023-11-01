<template>
    <pa-popup
        ref="popup"
        :title="title"
        @submit="handleSubmit"
    >
        <view class="pa-popup-picker">
            <picker-view
                indicator-style="height:100rpx"
                :style="{ height }"
                :value="value"
                @change="bindChange"
            >
                <picker-view-column v-for="(colunm,index) in opts" :key="index">
                    <view
                        v-for="(item,inx) in colunm"
                        :key="inx"
                        class="pa-popup-picker-item"
                        :class="{ small: opts.length > 1 && item.label.length > 6 && item.label.length < 10,mini: opts.length > 1 && item.label.length >= 10 }"
                    >{{ item.label }}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </pa-popup>
</template>

<script>
import { isNullOrEmpty } from '@/utils'
export default {
    name: 'PaPopupPicker',
    props: {
        opts: Array,
        title: String,
        height: {
            type: String,
            default: '400rpx'
        },
    },
    data() {
        return {
            value: [],
            lock: false
        }
    },
    methods: {
        open(data, isId) {
            this.$nextTick(() => {
                if (!isNullOrEmpty(data)) {
                    this.lock = true
                    if (isId) {
                        this.value = data
                    } else {
                        this.value = data.map((i, inx) => {
                            return this.opts[inx].findIndex(j => {
                                return j.value === i
                            })
                        })
                    }
                    setTimeout(() => {
                        this.lock = false
                    }, 200)
                } else {
                    this.value = this.opts.map(i => 0)
                }
            })
            this.$refs.popup.open()
        },
        bindChange(e) {
            if (this.lock) return
            this.value = e.detail?.value
            this.value = this.value.map(i => {
                if (i === -1) {
                    return 0
                } else {
                    return i
                }
            })
            const value = this.value?.map((i, inx) => {
                return this.opts?.[inx]?.[i]?.value
            })
            console.log('this.value', this.value)
            this.$emit('change', value, this.value)
        },
        handleSubmit() {
            this.value = this.value.map(i => {
                if (i === -1) {
                    return 0
                } else {
                    return i
                }
            })
            let value, label
            if (!this.value || (this.value && this.value.length === 0)) {
                this.opts.forEach((opt, index) => {
                    const val = [opt?.[0].value]
                    const lab = [opt?.[0].label]
                    value = val
                    label = lab
                })
                this.value = this.opts.map(i => 0)
            } else {
                value = this.value?.map((i, inx) => {
                    return this.opts?.[inx]?.[i]?.value
                })
                label = this.value?.map((i, inx) => {
                    return this.opts?.[inx]?.[i]?.label
                })
            }
            this.$emit('submit', value, label, this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-popup-picker{
    &-item{
        height: 100rpx;
        font-size: 34rpx;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        flex-wrap: nowrap;
        &.small{
            font-size: 26rpx;
        }
        &.mini{
            font-size: 22rpx;
        }
    }
}
</style>
