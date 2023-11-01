<template>
    <view class="pa-date-picker">
        <picker-view :value="value" style="height:400rpx" @change="bindChange">
            <picker-view-column>
                <view v-for="(item,index) in years" :key="index" class="picker">{{ item }}年</view>
            </picker-view-column>
            <picker-view-column>
                <view v-for="(item,index) in months" :key="index" class="picker">{{ item }}月</view>
            </picker-view-column>
            <picker-view-column>
                <view v-for="(item,index) in days" :key="index" class="picker">{{ item }}日</view>
            </picker-view-column>
        </picker-view>
    </view>
</template>
<script>
import dayjs from 'dayjs'
export default {
    name: 'PaDatePicker',
    props: {
        startTime: {
            type: [String, Number, Date, Object],
            default: '1990/1/1'
        },
        endTime: {
            type: [String, Number, Date, Object],
            default: () => dayjs().add(1, 'Y').format('YYYY/MM/DD')
        },
        heightRpx: {
            type: String
        },
        time: {
            type: [String, Number],
            default: new Date()
        }
    },
    data() {
        return {
            years: [],
            months: [],
            days: [],
            dayLength: 30,
            value: [0, 0, 0],
            visible: false,
            month: '',
            year: '',
            flag: false,
            start: '',
            end: ''
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init(time = this.time) {
            this.start = this.startTime || '1990/1/1'
            this.end = this.end || dayjs().add(1, 'Y').format('YYYY/MM/DD')
            this.years = []
            this.months = []
            this.days = []
            this.dayLength = 30
            this.value = [0, 0, 0]
            this.visible = false
            this.month = ''
            this.year = ''
            this.flag = false
            time = new Date(this.time)
            const year = time.getFullYear()
            const month = time.getMonth() + 1
            this.month = month
            this.year = year
            this.getDaysInOneMonth(year, month)
            this.getYears()

            const startTimeMouth = new Date(this.start).getMonth() + 1
            const startTimeDay = new Date(this.start).getDate()

            const endTimeMouth = new Date(this.end).getMonth() + 1
            const endTimeDay = new Date(this.end).getDate()

            if (this.year === this.years[0]) {
                this.getMonth(startTimeMouth)
                if (this.month === startTimeMouth - 1) {
                    this.getDays(1, startTimeDay)
                } else {
                    this.getDays()
                }
            } else if (this.year === this.years[this.years.length - 1]) {
                this.getMonth(1, endTimeMouth)
                if (this.month === endTimeMouth) {
                    this.getDays(1, endTimeDay)
                } else {
                    this.getDays()
                }
            } else {
                this.getMonth()
                this.getDays()
            }
            this.$emit('change', this.year, this.month, time.getDate())
            this.$nextTick(() => {
                this.value = [this.years.indexOf(this.year), this.months.indexOf(this.month), this.days.indexOf(time.getDate())]
            })
        },
        bindChange: function(e) {
            this.getDaysInOneMonth(this.years[e.target.value[0]], this.months[e.target.value[1]])
            this.flag = true
            const val = e.detail.value
            this.year = this.years[val[0]]
            this.month = parseInt(this.months[val[1]] < 10 ? '0' + this.months[val[1]] : this.months[val[1]])
            this.day = this.days[val[2]] < 10 ? '0' + this.days[val[2]] : this.days[val[2]]

            this.getYears()

            const startTimeMouth = new Date(this.start).getMonth() + 1
            const startTimeDay = new Date(this.start).getDate()

            const endTimeMouth = new Date(this.end).getMonth() + 1
            const endTimeDay = new Date(this.end).getDate()

            if (this.year === this.years[0]) {
                this.getMonth(startTimeMouth)
                if (this.month === startTimeMouth - 1) {
                    this.getDays(1, startTimeDay)
                } else {
                    this.getDays()
                }
            } else if (this.year === this.years[this.years.length - 1]) {
                this.getMonth(1, endTimeMouth)
                if (this.month === endTimeMouth) {
                    this.getDays(1, endTimeDay)
                } else {
                    this.getDays()
                }
            } else {
                this.getMonth()
                this.getDays()
            }
            this.$emit('change', this.year, this.month, this.day)
        },
        // 获得年份
        getYears() {
            this.years = []
            const startTimeYear = new Date(this.start).getFullYear()
            const endTimeYear = new Date(this.end).getFullYear()
            for (let i = +startTimeYear; i <= +endTimeYear; i++) {
                this.years.push(i)
            }
        },
        // 获取月份
        getMonth(min, max) {
            this.months = []
            for (let i = min || 1; max ? i <= max : i <= 12; i++) {
                this.months.push(i)
            }
        },
        getDays(min, max) {
            this.days = []
            for (let i = min || 1; max ? i <= max : i <= this.dayLength; i++) {
                this.days.push(i)
            }
        },
        // 获取某年某月多少天
        getDaysInOneMonth(year, month) {
            month = parseInt(month, 10)
            const d = new Date(year, month, 0)
            this.dayLength = isNaN(d.getDate()) ? 30 : d.getDate()
            this.getDays()
            return d.getDate()
        },
    }
}
</script>
<style lang="scss">
.pa-date-picker{
    .picker{
        font-size: 32rpx;
        font-weight: 500;
        color: #333336;
        line-height: 48rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .uni-picker-view-indicator{
        height: 88rpx;
        background: #999;
        opacity: 0.1;
        &:before{
            display: none;
        }
        &:after{
            display: none;
        }
    }
}
</style>
