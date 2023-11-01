<template>
    <view class="pa-tags">
        <view
            v-for="(item,index) in opts"
            :key="index"
        >
            <view
                v-if="item.type === 'ternary'"
                class="pa-tags-item"
                :class="{
                    active: checktTernaryActive(item),
                    disabled: item.disabled
                }"
                @click="handleClickTernary(item)"
            >
                <text class="pa-tags-item-text">{{ item.label }}</text>
                <image v-if="item.icon" class="pa-tags-item-icon" :src="getTernaryActiveCode(item) === 1 ? item.iconActive1 : getTernaryActiveCode(item) === 2 ? item.iconActive2 : item.icon" />
            </view>
            <view
                v-else
                class="pa-tags-item"
                :class="{
                    active: checkActive(item),
                    disabled: item.disabled
                }"
                @click="handleClick(item)"
            >
                <text class="pa-tags-item-text">{{ item.label }}</text>
                <image v-if="item.icon" class="pa-tags-item-icon" :src="checkActive(item) ? (item.iconActive || item.icon) : item.icon" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'PaTags',
    props: {
        value: [String, Array],
        opts: Array,
        muliple: Boolean,
        prop: String
    },
    data() {
        return {
            ternaryStatus: {}
        }
    },
    methods: {
        init() {
            this.opts.forEach(i => {
                if (i.type && i.type === 'ternary') {
                    this.ternaryStatus[i.label] = 0
                }
            })
        },
        checkActive({ value }) {
            if (this.muliple) {
                return this.value?.includes(value)
            } else {
                return this.value === value
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
            this.$emit('update:value', val)
            this.$emit('change', val, this.prop)
        },
        checktTernaryActive({ value1, value2 }) {
            if (this.muliple) {
                return this.value?.includes(value1) || this.value?.includes(value2)
            } else {
                return this.value === value1 || this.value === value2
            }
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
.pa-tags{
    display: flex;
    flex-wrap: wrap;
    &-item{
        padding:12rpx 24rpx;
        margin-right: 16rpx;
        margin-bottom: 16rpx;
        background: #F7F7F7;
        border-radius: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        font-weight: 400;
        color: #332C22;
        line-height: 34rpx;
        transition: all .3s;
        &.active{
            background: #FFEFD8;
            font-weight: 500;
            color: #F28900;
        }
        &.disabled{
            background: #F5F5F5;
            color: #ccc;
            font-weight: 400;
        }
        &-text{
            white-space: nowrap;
        }
        &-icon{
            width: 24rpx;
            height: 24rpx;
        }
    }
}
</style>
