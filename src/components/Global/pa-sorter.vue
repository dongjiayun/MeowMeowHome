<template>
    <view class="pa-sorter">
        <view
            v-for="(item,index) in data"
            :key="index"
            class="pa-sorter-item"
        >
            <view
                v-if="item.type === 'ternary'"
                class="pa-sorter-item-inner"
                :class="{
                    active: checktTernaryActive(item),
                    disabled: item.disabled
                }"
                @click="handleClickTernary(item)"
            >
                <text class="pa-sorter-item-inner-text">{{ item.label }}</text>
                <image class="pa-sorter-item-inner-icon" :src="getTernaryActiveCode(item) === 1 ? iconAsc : getTernaryActiveCode(item) === 2 ? iconDesc : icon" />
            </view>
            <view
                v-else-if="item.type === 'checkbox'"
                class="pa-sorter-item-inner"
                @click="handleClick(item)"
            >
                <pa-checkbox :value="checkActive(item)" :size="28" />
                <view style="margin-left: 6rpx" class="pa-sorter-item-inner-text">{{ item.label }}</view>
            </view>
            <view
                v-else
                class="pa-sorter-item-inner"
                :class="{
                    active: checkActive(item),
                    disabled: item.disabled
                }"
                @click="handleClick(item)"
            >
                <text class="pa-sorter-item-inner-text">{{ item.label }}</text>
            </view>
        </view>
        <slot name="append" />
    </view>
</template>

<script>

export default {
    name: 'PaSorter',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        muliple: {
            type: Boolean,
        },
        value: [String, Array, Number],
        hasDefault: {
            type: Boolean,
        }
    },
    data() {
        return {
            icon: require('@/static/common/sort.png'),
            iconAsc: require('@/static/common/sort_asc.png'),
            iconDesc: require('@/static/common/sort_desc.png'),
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            if (this.hasDefault) {
                const val = this.data?.[0]?.type === 'ternary' ? this.data?.[0].value1 : this.data?.[0].value
                this.$emit('update:value', val)
                this.$emit('change', val, this.prop)
            }
        },
        checkActive({ value }) {
            if (this.muliple) {
                return this.value?.includes(value)
            } else {
                return this.value === value
            }
        },
        checktTernaryActive({ value1, value2 }) {
            if (this.muliple) {
                return this.value?.includes(value1) || this.value?.includes(value2)
            } else {
                return this.value === value1 || this.value === value2
            }
        },
        handleClick({ disabled, value, readonly }) {
            if (disabled || readonly) return
            let val
            if (this.muliple) {
                if (this.value?.includes(value)) {
                    val = this.value.filter(i => i !== value)
                } else {
                    val = this.value ? [...this.value, value] : [value]
                }
            } else {
                if (this.value === value) {
                    val = ''
                } else {
                    val = value
                }
            }
            if (this.hasDefault && (this.muliple ? Array.isArray(val) && val.length === 0 : val === '')) {
                val = this.data?.[0]?.type === 'ternary' ? this.data?.[0].value1 : this.data?.[0].value
            }
            this.$emit('update:value', val)
            this.$emit('change', val, this.prop)
        },
        handleClickTernary({ disabled, value1, value2, readonly }) {
            if (disabled || readonly) return
            let val
            if (this.muliple) {
                if (this.value?.includes(value1)) {
                    val = this.value.filter(i => i !== value1)
                    val.push(value2)
                } else if (this.value?.includes(value2)) {
                    val = this.value.filter(i => i !== value2)
                } else {
                    val = this.value ? [...this.value, value1] : [value1]
                }
            } else {
                if (this.value === value1) {
                    val = value2
                } else if (this.value === value2) {
                    val = ''
                } else {
                    val = value1
                }
            }
            if (this.hasDefault && (this.muliple ? Array.isArray(val) && val.length === 0 : val === '')) {
                val = this.data?.[0]?.type === 'ternary' ? this.data?.[0].value1 : this.data?.[0].value
            }
            this.$emit('update:value', val)
            this.$emit('change', val, this.prop)
        },
        getTernaryActiveCode({ value1, value2 }) {
            if (this.muliple) {
                if (this.value?.includes(value1)) {
                    return 1
                } else if (this.value?.includes(value2)) {
                    return 2
                } else {
                    return 0
                }
            } else {
                if (this.value === value1) {
                    return 1
                } else if (this.value === value2) {
                    return 2
                } else {
                    return 0
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-sorter{
    display: flex;
    align-items: center;
    justify-content: space-around;
    &-item{
        padding: 16rpx 0 ;
        &-inner{
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(0,0,0,0.5);
            line-height: 40rpx;
            display: flex;
            align-items: center;
            &.active{
                font-weight: 500;
                color:#F28900
            }
            &.disabled{
                color: #ccc;
            }
            &-icon{
                width: 24rpx;
                height: 24rpx;
            }
        }
    }
}
</style>
