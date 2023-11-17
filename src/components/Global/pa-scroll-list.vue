<template>
    <!--
        :style=“object" 在微信小程序中编译为 style=”[object,object],所以要加上[]
        https://blog.csdn.net/HXH_csdn/article/details/113864516
    -->
    <view class="scroll-list-wrap" :style="[scrollListWrapStyle]">
        <scroll-view
            class="scroll-view"
            :class="[elClass]"
            :style="{ height: scrollBarHeight }"
            scroll-y
            scroll-anchoring
            enable-back-to-top
            :scroll-top="scrollTop"
            :lower-threshold="defaultOption.lowerThreshold"
            scroll-with-animation
            @scroll="handleScroll"
            @touchend="handleTouchEnd"
            @touchmove.prevent.stop="handleTouchMove"
            @touchstart="handleTouchStart"
            @scrolltolower="handleScrolltolower"
            @scrolltoupper="handleScrolltoupper"
        >
            <view class="scroll-content" :style="[scrollContentStyle]">
                <view class="pull-down-wrap">
                    <slot v-if="$slots.pulldown" name="pulldown" />
                    <view v-else class="refresh-view" :style="[refreshViewStyle]">
                        <view class="pull-down-animation" :class="{ refreshing: refreshing }" :style="[pullDownAnimationStyle]" />
                        <text class="pull-down-text" :style="[pullDownTextStyle]">{{ refreshStateText }}</text>
                    </view>
                </view>
                <view v-if="showEmpty" class="empty-wrap">
                    <slot v-if="$slots.empty" name="empty" />
                    <view v-else class="empty-view">
                        <!-- <image class="empty-image" :src="defaultOption.emptyImage || images.empty" mode="aspectFit" />
                        <text class="empty-text" :style="[emptyTextStyle]">{{ emptyText }}</text> -->
                        <!-- TODO：从当前组件中移除，组件独立 -->
                        <pa-empty :style="[emptyTextStyle]" :description="emptyText" />
                    </view>
                </view>
                <view class="list-content">
                    <slot />
                </view>
                <view v-if="showPullUp" class="pull-up-wrap">
                    <slot v-if="$slots.pullup" name="pullup" />
                    <view v-else>
                        <view v-if="loading" class="load-view">
                            <view class="pull-up-animation" :style="[pullUpAnimationStyle]" />
                            <text class="pull-up-text" :style="[pullUpTextStyle]">{{ loadStateText }}</text>
                        </view>
                        <view v-else class="load-view">
                            <slot v-if="$slots.nomore" name="nomore" />
                            <!-- <text v-else class="pull-up-text" :style="[pullUpTextStyle]">{{ loadStateText }}</text>-->
                            <view>没有更多了~ </view>
                        </view>
                    </view>
                </view>
                <!-- 为了调整底部高度 -->
                <view v-if="$slots.bottom" class="scroll-list-bottom">
                    <slot name="bottom" />
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
/**
 * scroll-list
 * slot {
 *  pullup
 *  empty 加载为空
 *  pulldown
 *  nomore // 注意目前是和pullup互斥
 * }
 * options:
    page: 1, // 分页
    size: 15, // 分页大小
    auto: true, // 自动加载
    height: null, // 组件高度
    disabled: false, // 禁用
    background: '', // 背景颜色属性
    emptyImage: '', // 空数据提示图片
    offsetBottom: 0, // 底部高度补偿
    pullDownSpeed: 0.5, // 下拉速率
    lowerThreshold: 40, // 距离底部上拉加载距离
    refresherThreshold: 80, // 距离顶部下拉刷新距离
    refreshDelayed: 800, // 刷新延迟
    refreshFinishDelayed: 800, // 刷新完成后的延迟
    safeArea: false, // 是否开启安全区域适配
    emptyTextColor: '#82848a', // 空提示文字颜色
    loadTextColor: '#82848a', // 上拉加载文字颜色
    loadIconColor: '#82848a', // 上拉加载图标颜色
    refresherTextColor: '#82848a', // 下拉刷新文字颜色
    refresherIconColor: '#82848a', // 下拉刷新图标颜色
    emptyText: '暂无列表~', // 空数据提示文字
    loadingText: '正在加载中~', // 加载中文字
    loadFailText: '加载失败啦~', // 加载失败文字
    noMoreText: '没有更多啦~', // 没有更多文字
    refreshingText: '正在刷新~', // 正在刷新文字
    refreshFailText: '刷新失败~', // 刷新失败文字
    refreshSuccessText: '刷新成功~', // 刷新成功文字
    pulldownText: '下拉刷新~', // 下拉中的文字
    pulldownFinishText: '松开刷新~' // 下拉完成的文字
 */
const images = {
    empty: require('@/static/base/empty.png'),
    success: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjxwYXRoIGQ9Ik0xMCAyNEwyMCAzNEw0MCAxNCIgc3Ryb2tlPSIjMzAzMTMzIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
    error: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjxwYXRoIGQ9Ik0xNCAxNEwzNCAzNCIgc3Ryb2tlPSIjMzAzMTMzIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xNCAzNEwzNCAxNCIgc3Ryb2tlPSIjMzAzMTMzIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=='
}
export default {
    name: 'PaScrollList',
    props: {
        // 配置信息
        option: {
            type: Object,
            default: () => ({})
        },
        manualScrollTop: Number,
        scrollBarHeight: String
    },
    data() {
        return {
            defaultOption: {
                page: 1, // 分页
                size: 20, // 分页大小
                auto: true, // 自动加载
                height: null, // 组件高度
                disabled: false, // 禁用
                background: '', // 背景颜色属性
                emptyImage: '', // 空数据提示图片
                offsetBottom: 0, // 底部高度补偿
                pullDownSpeed: 0.5, // 下拉速率
                lowerThreshold: 40, // 距离底部上拉加载距离
                refresherThreshold: 80, // 距离顶部下拉刷新距离
                refreshDelayed: 800, // 刷新延迟
                refreshFinishDelayed: 800, // 刷新完成后的延迟
                safeArea: false, // 是否开启安全区域适配
                emptyTextColor: '#82848a', // 空提示文字颜色
                loadTextColor: '#82848a', // 上拉加载文字颜色
                loadIconColor: '#82848a', // 上拉加载图标颜色
                refresherTextColor: '#82848a', // 下拉刷新文字颜色
                refresherIconColor: '#82848a', // 下拉刷新图标颜色
                // emptyText: '可恶，竟然没有相关内容', // 空数据提示文字
                emptyText: '暂无搜索结果', // 空数据提示文字
                loadingText: '正在加载中~', // 加载中文字
                loadFailText: '加载失败啦~', // 加载失败文字
                // noMoreText: '到底了喵~', // 没有更多文字
                noMoreText: '没有更多了~', // 没有更多文字
                refreshingText: '正在刷新~', // 正在刷新文字
                refreshFailText: '刷新失败~', // 刷新失败文字
                refreshSuccessText: '刷新成功~', // 刷新成功文字
                pulldownText: '下拉刷新~', // 下拉中的文字
                pulldownFinishText: '松开刷新~' // 下拉完成的文字
            },
            images, // 内置图片
            elClass: '', // 组件动态class
            windowInfo: {}, // 窗口信息
            scrollTop: 0, // 距离顶部滚动高度
            scrollViewTop: -1, // 滚动视图顶部位置
            scrollViewHeight: 0, // 滚动视图高度
            currentPage: 1, // 当前分页页码
            currentSize: 20, // 当前分页大小
            currentScrollTop: 0, // 当前滚动高度
            emptyText: '暂无列表~',
            loadStateText: '正在加载中~', // 加载状态文字
            refreshStateText: '下拉刷新~', // 刷新状态文字
            loadDisabled: false, // 是否禁用上拉加载
            loadDownDisabled: false, // 是否禁用下拉加载
            loading: false, // 是否加载中
            refreshing: false, // 是否刷新中
            refreshFinish: false, // 是否刷新完成
            pulldowning: false, // 是否正在下拉
            pullDownHeight: 0, // 下拉高度
            showEmpty: false, // 是否显示空数据提示
            showPullUp: false, // 是否显示上拉加载
            showPullDown: false, // 是否显示下拉刷新
            noMore: false
        }
    },
    computed: {
        scrollListWrapStyle() {
            const style = {}
            style.background = this.defaultOption.background
            return style
        },
        // // 组件容器样式
        // listWrapStyle() {
        //     const style = {}
        //     const { offsetBottom } = this.defaultOption
        //     if (this.scrollBarHeight) {
        //         style.height = this.scrollBarHeight
        //     } else {
        //         style.height = this.scrollViewHeight - uni.upx2px(offsetBottom) + 'px'
        //     }
        //     if (this.defaultOption.safeArea) style.paddingBottom = 'env(safe-area-inset-bottom) !important'
        //     console.log('style', style)
        //     return style
        // },
        // 滚动内容样式
        scrollContentStyle() {
            const style = {}
            const { pullDownHeight, pulldowning, showPullDown } = this
            style.transform = showPullDown ? `translateY(${pullDownHeight}px)` : `translateY(0px)`
            style.transition = pulldowning ? `transform 100ms ease-out` : `transform 200ms cubic-bezier(0.19,1.64,0.42,0.72)`
            return style
        },
        // 下拉刷新样式
        refreshViewStyle() {
            const style = {}
            const { showPullDown } = this
            style.opacity = showPullDown ? 1 : 0
            return style
        },
        // 下拉中动画样式
        pullDownAnimationStyle() {
            const style = {}
            const { refresherIconColor, refresherThreshold } = this.defaultOption
            const { refreshing, pullDownHeight } = this
            const { r, g, b } = this.hexToRgb(refresherIconColor)
            const rate = pullDownHeight / refresherThreshold
            style.borderColor = `rgba(${r},${g},${b},0.2)`
            style.borderTopColor = refresherIconColor
            if (!refreshing) {
                style.transform = `rotate(${360 * rate}deg)`
                style.transition = 'transform 100ms linear'
            }
            return style
        },
        pullDownTextStyle() {
            const style = {}
            const { refresherTextColor } = this.defaultOption
            style.color = refresherTextColor
            return style
        },
        // 上拉中动画样式
        pullUpAnimationStyle() {
            const style = {}
            const { loadIconColor } = this.defaultOption
            const { r, g, b } = this.hexToRgb(loadIconColor)
            style.borderColor = `rgba(${r},${g},${b},0.2)`
            style.borderTopColor = loadIconColor
            return style
        },
        // 上拉中文字样式
        pullUpTextStyle() {
            const style = {}
            const { loadTextColor } = this.defaultOption
            style.color = loadTextColor
            return style
        },
        // 空数据提示文字样式
        emptyTextStyle() {
            const style = {}
            const { emptyTextColor } = this.defaultOption
            style.color = emptyTextColor
            return style
        },
    },
    watch: {
        scrollViewTop(val) {
            this.updateScrollView()
        },
        manualScrollTop(val) {
            this.scrollTop = val
        }
    },
    created() {
        this.elClass = 'scroll-view-' + this._uid
        this.windowInfo = uni.getSystemInfoSync()
    },
    mounted() {
        this.handleInit()
    },
    methods: {
        // 组件初始化
        handleInit() {
            // 合并配置
            this.defaultOption = Object.assign(this.defaultOption, this.option)
            this.showEmpty = !this.defaultOption.auto
            this.currentPage = this.defaultOption.page
            this.currentSize = this.defaultOption.size
            this.emptyText = this.defaultOption.emptyText
            this.loadStateText = this.defaultOption.loadingText
            this.refreshStateText = this.defaultOption.pulldownText
            // 计算高度
            this.queryRect('.' + this.elClass).then(rect => {
                // 设置组件顶部位置
                this.scrollViewTop = rect.top
                // 判断是否自动加载
                if (this.defaultOption.auto) this.load()
            })
        },
        // 加载数据
        load() {
            if (this.defaultOption.disabled || this.loading || this.loadDisabled) return
            // 开启正在加载
            this.loading = true
            // 设置正在加载状态文字
            this.loadStateText = this.defaultOption.loadingText
            // 显示上拉加载
            this.showPullUp = true
            // 分页参数
            const paging = { page: this.currentPage, size: this.currentSize }
            // 触发load事件
            this.$emit('load', paging)
        },
        setNoMore() {
            console.log('setNoMore')
            // 设置禁用上拉加载
            this.loadDisabled = true
            // 加载状态文字
            this.loadStateText = this.defaultOption.noMoreText
            // 加载完毕
            this.noMore = true
            // 关闭正在加载
            this.loading = false
            // 显示下拉加载
            this.showPullUp = true
            // 关闭正在刷新
            this.refreshing = false
            // 关闭正在下拉
            this.pulldowning = false
            // 延迟执行刷新完成后状态
            setTimeout(() => {
                // 设置刷新完成
                this.refreshFinish = true
                // 重置下拉高度
                this.pullDownHeight = 0
                // 隐藏下拉刷新
                this.showPullDown = false
                // 触发刷新失败事件
            }, this.defaultOption.refreshFinishDelayed)
        },
        // 加载成功
        loadSuccess(data = {}) {
            // 解构数据
            const { list, total } = data
            // 判断列表是否是数组
            if (Array.isArray(list)) {
                // 判断列表长度
                if (list.length) {
                    // 判断列表长度和列表总数是否相同
                    if (list.length >= total) {
                        // 设置禁用上拉加载
                        this.loadDisabled = true
                        // 加载状态文字
                        this.loadStateText = this.defaultOption.noMoreText
                        // 加载完毕
                        this.noMore = true
                    } else {
                        // 关闭禁用上拉加载
                        this.loadDisabled = false
                        // 设置分页参数
                        this.currentPage++
                        // 加载状态为加载中
                        this.loadStateText = this.defaultOption.loadingText
                        // 加载计算
                        this.loadCompute()
                        // 加载中
                        this.noMore = false
                    }
                    // 显示上拉加载
                    this.showPullUp = true
                    // 隐藏空数据提示
                    this.showEmpty = false
                } else {
                    // 设置禁用上拉加载
                    this.loadDisabled = true
                    // 隐藏上拉加载
                    this.showPullUp = false
                    // 隐藏上拉加载
                    this.showPullUp = false
                    // 显示空数据提示
                    this.showEmpty = true
                }
                // 关闭正在加载
                this.loading = false
                // 触发加载成功事件
                this.$emit('loadSuccess', list)
            } else {
                // 不是数组类型当作加载失败处理
                this.loadFail()
            }
        },
        // 加载失败
        loadFail() {
            // 关闭正在加载
            this.loading = false
            // 关闭空数据提示
            this.showEmpty = false
            // 显示上拉加载
            this.showPullUp = true
            // 加载状态为加载失败
            this.loadStateText = this.defaultOption.loadFailText
            // 触发加载失败事件
            this.$emit('loadFail')
        },
        // 刷新数据
        refresh() {
            // 如果是下拉刷新
            if (this.pullDownHeight === this.defaultOption.refresherThreshold) {
                // 关闭正在加载
                this.loading = false
                // 隐藏上拉加载
                this.showPullUp = false
            } else {
                // 开启正在加载
                this.loading = true
                // 隐藏空数据提示
                this.showEmpty = false
                // 显示上拉加载
                this.showPullUp = true
                // 设置正在刷新状态文字
                this.loadStateText = this.defaultOption.refreshingText
            }
            // 设置刷新未完成
            this.refreshFinish = false
            // 开启正在刷新
            this.refreshing = true
            // 设置正在刷新状态文字
            this.refreshStateText = this.defaultOption.refreshingText
            // 设置分页参数
            this.currentPage = 1
            this.currentSize = this.defaultOption.size
            const paging = { page: this.currentPage, size: this.currentSize }
            // 触发refresh事件
            setTimeout(() => {
                this.$emit('refresh', paging)
            }, this.defaultOption.refreshDelayed)
        },
        // 刷新成功
        refreshSuccess(data) {
            // 解构数据
            const { list, total } = data
            // 判断列表是否是数组
            if (Array.isArray(list)) {
                // 判断列表长度
                if (list.length) {
                    // 判断列表长度和列表总数是否相同
                    if (list.length >= total) {
                        // 设置禁用上拉加载
                        this.loadDisabled = true
                        // 设置没有更多状态文字
                        this.loadStateText = this.defaultOption.noMoreText
                        // 加载完毕
                        this.noMore = true
                    } else {
                        // 设置分页参数
                        this.currentPage++
                        // 关闭禁用上拉加载
                        this.loadDisabled = false
                        // 设置加载中状态文字
                        this.loadStateText = this.defaultOption.loadingText
                        // 开启自动加载
                        this.defaultOption.auto = true
                        // 加载计算
                        this.loadCompute()
                        // 加载中
                        this.noMore = false
                    }
                    // 关闭空数据提示
                    this.showEmpty = false
                    // 显示上拉加载
                    this.showPullUp = true
                } else {
                    // 设置禁用上拉加载
                    this.loadDisabled = true
                    // 隐藏上拉加载
                    this.showPullUp = false
                    // 显示空数据提示
                    this.showEmpty = true
                    // 设置没有更多状态文字
                    this.loadStateText = this.defaultOption.noMoreText
                    // 加载完毕
                    this.noMore = true
                }
                // 关闭正在加载
                this.loading = false
                // 设置刷新成功状态文字
                this.refreshStateText = this.defaultOption.refreshSuccessText
                // 关闭正在刷新
                this.refreshing = false
                // 关闭正在下拉
                this.pulldowning = false
                // 触发刷新成功事件
                this.$emit('refreshSuccess', list)
                setTimeout(() => {
                    // 设置刷新完成
                    this.refreshFinish = true
                    // 重置下拉高度
                    this.pullDownHeight = 0
                    // 隐藏下拉刷新
                    this.showPullDown = false
                    this.$emit('refreshSuccess')
                }, this.defaultOption.refreshFinishDelayed)
            } else {
                // 不是数组类型当作刷新失败处理
                this.refreshFail()
            }
        },
        // 刷新失败
        refreshFail() {
            // 设置加载失败状态文字
            this.loadStateText = this.defaultOption.refreshFailText
            // 设置刷新失败状态文字
            this.refreshStateText = this.defaultOption.refreshFailText
            // 关闭正在加载
            this.loading = false
            // 显示下拉加载
            this.showPullUp = true
            // 关闭正在刷新
            this.refreshing = false
            // 关闭正在下拉
            this.pulldowning = false
            // 延迟执行刷新完成后状态
            setTimeout(() => {
                // 设置刷新完成
                this.refreshFinish = true
                // 重置下拉高度
                this.pullDownHeight = 0
                // 隐藏下拉刷新
                this.showPullDown = false
                // 触发刷新失败事件
                this.$emit('refreshError')
            }, this.defaultOption.refreshFinishDelayed)
        },
        // 加载计算
        loadCompute() {
            // 判断是否自动加载
            try {
                if (this.defaultOption.auto) {
                    // 延迟执行下否者可能会高度计算错误
                    setTimeout(() => {
                        this.$nextTick(() => {
                            this.queryRect('.list-content').then(rect => {
                                if (rect.height <= this.scrollViewHeight) {
                                    this.load()
                                }
                            })
                        })
                    }, 100)
                }
            } catch (error) {
                console.warn(error)
            }
        },
        // 上拉触底事件
        handleScrolltolower(e) {
            this.$emit('scrolltolower', e, this.loadDisabled)
            if (this.loadDisabled) return
            this.load()
        },
        // 滚动事件
        handleScroll(event) {
            this.currentScrollTop = event.detail.scrollTop
            this.$emit('scroll', event.detail)
        },
        // 触摸按下处理
        handleTouchStart(event) {
            if (this.defaultOption.disabled || this.defaultOption.loadDownDisabled) return
            this.currentTouchStartY = event.touches[0].clientY
            this.$emit('touchStart', event)
        },
        // 触摸按下滑动处理
        handleTouchMove(event) {
            if (this.defaultOption.disabled || this.currentScrollTop || this.defaultOption.loadDownDisabled) return
            if (event.touches[0].clientY >= this.currentTouchStartY) {
                this.pulldowning = true
                this.showPullDown = true
                const pullDownDistance = (event.touches[0].clientY - this.currentTouchStartY) * this.defaultOption.pullDownSpeed
                this.pullDownHeight = pullDownDistance > this.defaultOption.refresherThreshold ? this.defaultOption.refresherThreshold : pullDownDistance
                this.refreshStateText =
                    this.pullDownHeight >= this.defaultOption.refresherThreshold ? this.defaultOption.pulldownFinishText : this.defaultOption.pulldownText
                this.$emit('touchMove', event)
            }
        },
        // 触摸松开处理
        handleTouchEnd(event) {
            if (this.defaultOption.disabled || this.defaultOption.loadDownDisabled) return
            // 当下拉高度小于下拉阈值
            if (this.pullDownHeight < this.defaultOption.refresherThreshold) {
                // 关闭正在下拉
                this.pulldowning = false
                // 重置下拉高度
                this.pullDownHeight = 0
                // 隐藏下拉刷新
                this.showPullDown = false
                // 触发下拉中断事件
                this.$emit('refreshStop')
            } else {
                this.refresh()
            }
            // 触发下拉触摸松开事件
            this.$emit('touchEnd', event)
        },
        // 更新组件
        updateScrollView() {
            if (this.defaultOption.height) {
                this.scrollViewHeight = uni.upx2px(this.defaultOption.height)
            } else {
                this.scrollViewHeight = this.windowInfo.windowHeight - this.scrollViewTop
            }
            try {
                this.scrollViewObserve()
            } catch (error) {
                console.warn(error)
            }
        },
        // // 监听列表高度变化
        // listContentObserve() {
        //     this.disconnectObserve('_listContentObserve')
        //     const listContentObserve = this.createIntersectionObserver({
        //         thresholds: [0, 0.5, 1]
        //     })
        //     listContentObserve.relativeToViewport({
        //         // #ifdef H5
        //         top: -(this.windowInfo.windowTop + rect.top),
        //         // #endif
        //         // #ifndef H5
        //         top: -rect.top
        //         // #endif
        //     })
        // },
        // 监听组件位置变化
        scrollViewObserve() {
            this.disconnectObserve('_scrollViewObserve')
            this.$nextTick(() => {
                this.queryRect('.' + this.elClass).then(rect => {
                    const scrollViewObserve = this.createIntersectionObserver({
                        thresholds: [0, 0.5, 1]
                    })
                    scrollViewObserve.relativeToViewport({
                        // #ifdef H5
                        top: -(this.windowInfo.windowTop + rect.top),
                        // #endif
                        // // #ifndef H5
                        // top: -rect.top
                        // // #endif
                    })
                    scrollViewObserve.observe('.' + this.elClass, position => {
                        // #ifdef H5
                        this.scrollViewTop = position.boundingClientRect.top - this.windowInfo.windowTop
                        // #endif
                        // #ifndef H5
                        this.scrollViewTop = position.boundingClientRect.top
                        // #endif
                    })
                    this._scrollViewObserve = scrollViewObserve
                })
            })
        },
        // 断开监听组件
        disconnectObserve(observerName) {
            const observer = this[observerName]
            observer && observer.disconnect()
        },
        // 查询dom节点信息
        queryRect(selector, all) {
            return new Promise(resolve => {
                uni.createSelectorQuery()
                    .in(this)[all ? 'selectAll' : 'select'](selector)
                    .boundingClientRect(rect => {
                        if (all && Array.isArray(rect) && rect.length) {
                            resolve(rect)
                        }
                        if (!all && rect) {
                            resolve(rect)
                        }
                    })
                    .exec()
            })
        },
        // 16进制转RGB
        hexToRgb(hex) {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
            hex = hex.replace(shorthandRegex, (m, r, g, b) => {
                return r + r + g + g + b + b
            })
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                }
                : null
        },
        scrollToTop() {
            this.scrollTop = -1
            this.$nextTick(() => {
                this.scrollTop = 0
            })
        },
        handleScrolltoupper() {
            this.$emit('scrolltoupper')
        },
    }
}
</script>

<style lang="scss">
.scroll-list-wrap {
    box-sizing: border-box;
    ::v-deep .scroll-view {
        position: relative;
        .scroll-content {
            height: 100%;
            width: 100%;
            display: flex;
            will-change: transform;
            flex-direction: column;
            .pull-down-wrap {
                left: 0;
                width: 100%;
                display: flex;
                padding: 30rpx 0;
                position: absolute;
                align-items: flex-end;
                justify-content: center;
                transform: translateY(-100%);
                .refresh-view {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .pull-down-animation {
                        width: 32rpx;
                        height: 32rpx;
                        border-width: 4rpx;
                        border-style: solid;
                        border-radius: 50%;
                        &.refreshing {
                            animation: spin 0.5s linear infinite;
                        }
                        @keyframes spin {
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    }
                    .pull-down-text {
                        margin-left: 10rpx;
                    }
                }
            }
            .empty-wrap {
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                // position: absolute;
                align-items: center;
                flex-direction: column;
                .empty-view {
                    margin: auto;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    .empty-image {
                        width: 200rpx;
                        height: 200rpx;
                    }
                    .empty-text {
                        color: #606266;
                        margin-top: 20rpx;
                    }
                }
            }
            .pull-up-wrap {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 32rpx;
                .load-view {
                    padding: 8rpx 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28rpx;
                    color: #aaa;
                    .pull-up-animation {
                        width: 32rpx;
                        height: 32rpx;
                        border-width: 4rpx;
                        border-style: solid;
                        border-radius: 50%;
                        animation: spin 0.5s linear infinite;
                    }
                    .pull-up-text {
                        margin-left: 10rpx;
                    }
                }
            }
        }
    }
}
</style>
