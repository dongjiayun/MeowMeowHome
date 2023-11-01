/*
 * @Author: ge.rongyin
 * @Date: 2020-07-16 12:56:59
 * @LastEditors: ge.rongyin
 * @LastEditTime: 2020-08-20 15:24:28
 * @FilePath: \src\utils\filters.js
 * @Description: 全局过滤器
 */
/** *---------------全局过滤器--------------***/
import * as filters from '@/utils/filters'

export default /** @type {import('vue').PluginFunction<never>} */ (Vue) => {
    Object.entries(filters).forEach(([name, filter]) =>
        Vue.filter(name, (...args) => filter(...args) ?? '-'))
}
