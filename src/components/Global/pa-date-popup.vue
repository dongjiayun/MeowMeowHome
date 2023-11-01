<template>
    <pa-popup
        ref="form"
        class="pingan-popup"
        type="bottom"
        background-color="#fff"
        :title="title"
        @submit="submitHandle"
    >
        <pa-date-picker
            ref="picker"
            :start-time="startTime"
            :end-time="endTime"
            :time="time"
            @change="dateHandle"
        />
    </pa-popup>
</template>

<script>
import dayjs from 'dayjs'
export default {
    name: 'PaDatePopup',
    props: {
        title: {
            type: String,
            default: ''
        },
        startTime: [String, Number, Date, Object],
        endTime: [String, Number, Date, Object],
    },
    data() {
        return {
            date: '',
            time: null,
            ready: false
        }
    },
    methods: {
        open(time = new Date().getTime()) {
            this.time = dayjs(time).valueOf()
            this.$refs.form.open()
            this.$nextTick(() => {
                this.$refs.picker.init()
            })
        },
        dateHandle(year, month, day) {
            let date = `${year}/${month}/${day}`
            if (dayjs(date).isBefore(dayjs(this.startTime))) {
                date = dayjs(this.startTime)
            }
            this.date = dayjs(new Date(date)).valueOf()
        },
        submitHandle() {
            const date = this.date ? dayjs(this.date).valueOf() : dayjs(this.startTime).valueOf()
            this.$emit('submit', date || new Date().getTime())
            this.$refs.form.close()
        }
    }
}
</script>

<style scoped>

</style>
