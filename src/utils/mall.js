import { discountModel, activityModel, userModel } from '@/api'
import { toast, Toast } from '@/utils'

export const getCouponPackage = async activityId => {
    const params = {
        activityId
    }
    Toast.loading()
    try {
        const { data: couponPackage } = await activityModel.queryPackage(params)
        const { packageId } = couponPackage
        const _p = {
            activityId,
            packageId,
            number: 1
        }
        await discountModel.collectDiscount(_p).then(res => {
            if (res.status === 0) {
                toast({ title: '领取成功' })
            } else {
                toast({ title: res.message })
            }
        })
    } finally {
        Toast.hide()
    }
}

export const checkOrderSplitted = async orderNo => {
    console.log('checkOrderSplitted', orderNo)
    const params = {
        orderNo
    }
    Toast.loading()
    try {
        const { data } = await userModel.orderDetail(params)
        const { isSplitted } = data
        return isSplitted
    } catch (e) {
        toast({ title: '订单拆分查询失败' })
    } finally {
        Toast.hide()
    }
}
