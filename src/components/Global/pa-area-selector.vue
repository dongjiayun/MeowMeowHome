<template>
    <view class="pa-area-selector">
        <pa-popup-picker
            ref="popup"
            title="选择地区"
            :opts="opts"
            @change="handleChange"
            @submit="handleSubmit"
        />
    </view>
</template>

<script>
import { commonModel } from '@/api'
export default {
    name: 'PaAreaSelector',
    data() {
        return {
            data: undefined,
            opts: [],
            value: [],
        }
    },
    methods: {
        async open(value) {
            await this.getData()
            if (value) {
                const isLabel = value?._isLabel
                let { province, city, area } = value
                if (isLabel) {
                    const provinceObj = this.data.find(i => province.includes(i.name))
                    const cityObj = provinceObj?.children?.find(i => city.includes(i.name))
                    const areaObj = cityObj?.children?.find(i => area === i.name)
                    province = provinceObj?.code
                    city = cityObj?.code
                    area = areaObj?.code
                    if (!province || !city || !area) {
                        this.$toast({ title: '没有匹配到您所在的地区,请重新选择~' })
                    }
                }
                this.value = this.valueFormat([province, city, area])
            } else {
                this.value = this.valueFormat([])
            }
            this.$refs.popup.open(this.value, true)
        },
        valueFormat([province, city, area]) {
            const provinceIndex = province ? this.data.findIndex(i => i.code === String(province)) : 0
            const provinceObj = this.data[provinceIndex >= 0 ? provinceIndex : 0]
            const cityIndex = city ? provinceObj.children.findIndex(i => i.code === String(city)) : 0
            const cityObj = provinceObj?.children[cityIndex >= 0 ? cityIndex : 0]
            const areaIndex = area ? cityObj?.children.findIndex(i => i.code === String(area)) : 0
            this.opts = [
                this.data.map(i => ({ label: i.name, value: i.code })),
                provinceObj?.children.map(i => ({ label: i.name, value: i.code })),
                cityObj?.children.map(i => ({ label: i.name, value: i.code }))
            ]
            return [provinceIndex, cityIndex, areaIndex >= 0 ? areaIndex : 0]
        },
        getData() {
            if (this.data) {
                return
            }
            return commonModel.getArea().then(res => {
                if (res.status === 0) {
                    this.data = res.data
                } else {
                    this.$toast({ title: res.message })
                }
            })
        },
        handleChange(value) {
            this.valueFormat(value)
        },
        handleSubmit([province, city, area], label) {
            this.$emit('submit', { province, city, area }, label)
        }
    }
}
</script>

<style scoped>

</style>
