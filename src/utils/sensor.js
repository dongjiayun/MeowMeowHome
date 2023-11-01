import Vue from 'vue'
import {buriedPoint} from '@/config/dict'
import config from "@/config";
import { Storage } from '@/utils/storage'

// #ifdef MP-WEIXIN
import sensors from 'sa-sdk-miniprogram'
import {isNullOrEmpty} from "@/utils/index";

export const initSensors = () => {
    // 配置初始化参数
    console.log(`${config.baseUrl}/buried/sa.gif`)
    sensors.setPara({
        name: 'sensors',
        server_url:`${config.baseUrl}/buried/event-track/sa.gif?project=unipet-miniprogram&remark=${config.buriedRemark}`,
        //server_url:'http://192.168.100.148:8000/sa.gif?project=unipet-miniprogram&remark=v1',
        // 全埋点控制开关
        autoTrack: {
            appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
            appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
            appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
            pageShow: false, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
            pageShare: false, // 默认为 true，false 则关闭 $MPShare 事件采集
            mpClick: false, // 默认为 false，true 则开启 $MPClick 事件采集
            mpFavorite: false, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
            pageLeave: false // 默认为 false， true 则开启 $MPPageLeave事件采集
        },
        // 自定义渠道追踪参数，如 source_channel: ["custom_param"]
        source_channel: [],
        // 是否允许控制台打印查看埋点数据(建议开启查看)
        show_log: true,
        // 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的 path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
        allow_amend_share_path: true
    })

    sensors.init()

    return sensors
}

export const track = (id,methodType = 0,params={})=>{
    if(isNullOrEmpty(id))return
    const openId = Storage.get('pa_open_id')
    const unionId = Storage.get('pa_union_id')
    let method = ''
    switch (methodType){
        case 0:
            method='$MPViewScreen'
            break
        case 1:
            method = '$MPClick'
            break
    }
    const sensor = Vue.prototype.$sensors
    sensor.track(method, {
        'unipet-miniprogram-buried-id':id,
        'unipet-miniprogram-openId':openId,
        'unipet-miniprogram-unionId':unionId,
        ...params
    })
}

// #endif

// #ifdef H5
export const initSensors = () => {
    return {
        login:()=>{},
        track:()=>{}
    }
}
//  #endif
