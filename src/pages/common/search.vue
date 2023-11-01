<template>
    <pa-container
        ref="container"
        is-page
        background="#FFFFFF"
    >
        <view class="pa-search">
            <pa-navbar>{{ title }}</pa-navbar>
            <pa-search
                :value="value"
                cancel-button="always"
                :placeholder="placeholder"
                :maxlength="20"
                bg-color="#F5F5F5"
                @confirm="handleConfirm"
                @cancel="handleCancel"
            />
            <view v-if="histories && histories.length > 0" class="pa-search-history">
                <view class="pa-search-history-title">
                    <view>搜索历史</view>
                    <image
                        class="pa-search-history-title-icon"
                        :src="require('@/static/base/trash.png')"
                        @click="handleClear"
                    />
                </view>
                <view class="pa-search-history-body">
                    <pa-tags
                        :value.sync="value"
                        :opts="histories"
                        @change="handleTagClick"
                    />
                </view>
            </view>
        </view>
    </pa-container>
</template>

<script>
import { uniqBy } from 'lodash'
import { isNullOrEmpty } from '@/utils'
import { mapGetters } from 'vuex'

export default {
    name: 'Search',
    onLoad({ title, placeholder, prop, to, cancelTo }) {
        this.title = decodeURIComponent(title)
        this.placeholder = decodeURIComponent(placeholder)
        this.prop = prop
        this.to = to
        this.cancelTo = cancelTo || to
    },
    onShow() {
        this.getHistory()
    },
    data() {
        return {
            title: undefined,
            placeholder: undefined,
            prop: undefined,
            to: undefined,
            value: undefined,
            cancelTo: undefined,
            histories: []
        }
    },
    computed: {
        ...mapGetters(['cid'])
    },
    methods: {
        handleConfirm(value) {
            if (isNullOrEmpty(value) || value === '') {
                return
            }
            const history = uniqBy([{ value, label: value }, ...this.histories], 'value')
            if (history.length > 6) {
                history.pop()
            }
            this.$storage.set(`pa_search_history_${this.prop}_${this.cid}`, history)
            this.$Router.push({
                name: this.to,
                query: {
                    [this.prop]: value
                }
            })
        },
        getHistory() {
            const history = this.$storage.get(`pa_search_history_${this.prop}_${this.cid}`) || []
            this.histories = history
        },
        handleClear() {
            this.$refs.container.showConfirm({
                content: '确认删除所有记录吗？',
                confirmText: '确认删除',
                confirm: () => {
                    this.$storage.remove(`pa_search_history_${this.prop}_${this.cid}`)
                    this.histories = []
                }
            })
        },
        handleTagClick(value) {
            this.handleConfirm(value)
        },
        handleCancel() {
            this.$Router.back()
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-search{
    min-height: 100vh;
    &-history{
        padding:24rpx;
        &-title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 24rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: #332C22;
            &-icon{
                width: 32rpx;
                height: 32rpx;
            }
        }
    }
}
</style>
