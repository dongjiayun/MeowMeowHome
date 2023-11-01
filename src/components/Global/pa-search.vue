<template>
    <view class="pa-search-bar">
        <custom-search-bar
            :value="value"
            :radius="30"
            :cancel-button="cancelButton"
            :placeholder="placeholder"
            :clear-button="clearButton"
            :readonly="readonly"
            :maxlength="maxlength"
            :bg-color="bgColor"
            @input="handleChange"
            @confirm="handleSearch"
            @clear="handleClear"
            @cancel="handleCancel"
        >
            <template #searchIcon>
                <view class="pa-search-bar-icon">
                    <image class="pa-search-bar-icon-inner" :src="require('static/global/search.png')" />
                </view>
            </template>
        </custom-search-bar>
    </view>
</template>

<script>
import { isNullOrEmpty } from '@/utils'
import customSearchBar from '../custom-search-bar'
export default {
    name: 'PaSearch',
    components: { customSearchBar },
    props: {
        value: [String, Number],
        placeholder: String,
        cancelButton: {
            type: String,
            default: 'none'
        },
        clearButton: String,
        readonly: Boolean,
        maxlength: Number,
        bgColor: String
    },
    data() {
        return {
            searchValue: undefined
        }
    },
    onShow() {
        this.searchValue = this.value
    },
    methods: {
        handleChange(value) {
            this.searchValue = String(value).trim()
        },
        handleSearch() {
            if (!isNullOrEmpty(this.searchValue.trim())) {
                this.$emit('confirm', this.searchValue)
            } else {
                this.searchValue = ''
            }
        },
        handleClear() {
            this.$emit('clear')
        },
        handleCancel() {
            this.$emit('cancel')
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-search-bar{
    padding:16rpx 24rpx;
    width: 100%;
    ::v-deep .uni-searchbar__cancel{
        font-size: 28rpx;
        font-weight: 400;
        color: rgba(0,0,0,0.5);
    }
    &-icon{
        display: flex;
        align-items: center;
        justify-content: center;
        &-inner{
            width: 32rpx;
            height: 32rpx;
        }
    }
}
</style>
