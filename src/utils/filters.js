/**
 * @file Vue 全局过滤器
 *
 * 将过滤器定义在独立的模块中以便在 Vue 之外使用
 */

import dayjs from 'dayjs'

/**
 * 金额千位分隔
 * @param {any} value 金额
 * @param {number} precision 精度
 * @returns {string | undefined} 数值
 */
export const formatThousandsNum = (value, hasYuan = true, precision = 2) => {
    const num = Number(value)

    if (isNaN(num) || num === 0) {
        return undefined
    } else {
        let text = `${num.toFixed(precision).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`

        if (hasYuan) {
            text += '元'
        }

        return text
    }
}

/**
 * 格式化时间
 *
 * @param {import('dayjs').dayjsInput} timestamp
 * @param {string} format
 * @returns {string | undefined}
 */
export const formatDateTime = function(timestamp, format = 'YYYY-MM-DD') {
    return timestamp ? dayjs(timestamp).format(format) : undefined
}

/**
 * 格式化百分比
 *
 * @param {number} percentage
 * @returns {string | undefined}
 */
export const formatPercentage = function(percentage) {
    return !Number.isFinite(percentage) ? undefined : `${percentage}%`
}

export const unitTransfer = (num = 0) => {
    return num >= 1e3 && num < 1e4 ? (num / 1e3).toFixed(1) + 'k' : num >= 1e4 ? (num / 1e4).toFixed(1) + 'w' : num
}
