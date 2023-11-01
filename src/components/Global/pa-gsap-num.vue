<template>
    <text>{{ innerValue === '-' ? '-' : abs ? Math.abs(formattedValue) : formattedValue }}</text>
</template>

<script>
import gsap from 'gsap'
import { toThousandsNum, isNullOrEmpty, numberUnitFormat } from '@/utils'

export default {
    name: 'PaGsapNum',
    props: {
        value: [Number, String],
        formatType: {
            type: String,
            default: 'toThousandsNum'
        },
        precision: {
            type: Number,
            default: 2
        },
        abs: Boolean,
        isInteger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            innerValue: 0
        }
    },
    computed: {
        formattedValue() {
            if (this.innerValue === '-') {
                return '-'
            } else {
                if (this.formatType === 'toThousandsNum') {
                    return toThousandsNum(this.innerValue, this.precision)
                } else if (this.formatType === 'numberUnitFormat') {
                    return numberUnitFormat(this.innerValue, this.precision, this.isInteger)
                } else {
                    return this.innerValue.toFixed(this.precision)
                }
            }
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(innerValue) {
                if (isNullOrEmpty(innerValue) || innerValue === '-') {
                    this.innerValue = '-'
                } else {
                    gsap.to(this, { duration: 0.6, innerValue: +innerValue })
                }
            }
        },
    },
    methods: {
        isNullOrEmpty
    }
}
</script>

