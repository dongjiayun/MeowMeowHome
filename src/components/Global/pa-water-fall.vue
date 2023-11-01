<template>
    <view class="pa-waterfall">
        <view v-for="(item,index) in falls" :ref="`column-${index}`" :key="index" class="pa-waterfall-list">
            <view v-for="(i,inx) in item" :ref="`row-${index}-${inx}`" :key="inx" class="pa-waterfall-list-item">
                <slot :item="i" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'PaWaterfall',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Number,
            default: 2
        }
    },
    data() {
        return {
            falls: []
        }
    },
    computed: {
        columnWidth() {
            const { windowWidth } = uni.getSystemInfoSync()
            return windowWidth
        }
    },
    watch: {
        data: {
            immediate: true,
            handler() {
                const arr = []
                for (let i = 0; i < this.columns; i++) {
                    arr.push([])
                }
                this.data.forEach((i, index) => {
                    const inx = index % this.columns
                    arr[inx].push(i)
                })
                this.falls = arr
                this.$nextTick(() => {
                    const columnsHeight = []
                    for (let i = 0; i < this.columns; i++) {
                        columnsHeight.push([])
                        this.falls[i].forEach((item, index) => {
                            const itemHeight = this.$refs[`row-${i}-${index}`]?.[0].$el.offsetHeight
                            columnsHeight[i].push(itemHeight)
                        })
                    }
                    while (true) { // eslint-disable-line
                        let maxCol = 0
                        let minCol = 0
                        for (let i = 1; i < this.columns; i++) {
                            if (columnsHeight[i] > columnsHeight[maxCol]) {
                                maxCol = i
                            }
                            if (columnsHeight[i] < columnsHeight[minCol]) {
                                minCol = i
                            }
                        }
                        const longLineLastItem = columnsHeight?.[maxCol]?.[columnsHeight[maxCol].length - 1]
                        if (columnsHeight[maxCol] - columnsHeight[minCol] > longLineLastItem) {
                            const item = this.falls[maxCol].pop()
                            this.falls[minCol].push(item)
                            columnsHeight[maxCol].pop()
                            columnsHeight[minCol].push(longLineLastItem)
                        } else {
                            break
                        }
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.pa-waterfall{
    display: flex;
    width: 100%;
    //padding: 0 30rpx;
    .pa-waterfall-list+.pa-waterfall-list{
        margin-left: 16rpx;
    }
    &-list{
        display: flex;
        flex-direction: column;
        flex:1;
        &-item{
            margin-bottom: 16rpx;
            .pa-waterfall-card{
                display: flex;
                flex-direction: column;
                &-image{
                    border-radius: 16rpx;
                    margin-bottom: 16rpx;
                }
                &-title{
                    font-size: 14px;
                    color: #333336;
                    font-weight: 500;
                    margin-bottom: 16rpx;
                }
                &-info{
                    display: flex;
                    justify-content: space-between;
                    &-item{
                        display: flex;
                        align-items: center;
                        .avatar{
                            width: 36rpx;
                            height: 36rpx;
                        }
                        .name{
                            margin-left: 8rpx;
                            font-size: 24rpx;
                            color: #9D9DA0;
                            font-weight: 400;
                        }
                        .like{
                            margin-left: 8rpx;
                            font-size: 24rpx;
                            color: #CECDCD;
                            font-weight: 400;
                        }
                    }
                }
            }
        }
    }
}
</style>
