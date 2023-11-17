import { noticeModel } from '@/api'
import { toast } from '@/utils'
import { Storage } from '@/utils/storage'
import user from '@/store/modules/user'

const business = {
    state: {
        noticeAmount: 0,
        noticeAmountInterval: undefined,
        noticeNewInterval: undefined
    },
    mutations: {
        SET_NOTICE_AMOUNT(state, noticeAmount) {
            state.noticeAmount = noticeAmount
        }
    },
    actions: {
        getNoticeAmount({ commit }) {
            if (!user.state.token) return
            return noticeModel.amount().then(res => {
                if (res.status === 0) {
                    commit('SET_NOTICE_AMOUNT', res.data)
                } else {
                    toast({ title: res.message })
                }
            })
        },
        getNewNotice() {
            if (!user.state.token) return
            const params = {
                pageNo: 1,
                pageSize: 1
            }
            return noticeModel.list(params).then(res => {
                if (res.status === 0) {
                    if (res.data.list && res.data.list.length) {
                        return res.data.list[0]
                    }
                } else {
                    toast({ title: res.message })
                }
            })
        },
        getNoticeAmountInterval({ state, dispatch }) {
            dispatch('getNoticeAmount')
            if (state.noticeAmountInterval) {
                clearInterval(state.noticeAmountInterval)
            }
            state.noticeAmountInterval = setInterval(() => {
                dispatch('getNoticeAmount')
            }, 5000)
        },
        checkNewNoticeIntervel({ state, dispatch }) {
            const func = async() => {
                const noticeCache = Storage.get('pa_newest_notice')
                const noticeNew = await dispatch('getNewNotice')
                if (noticeCache && noticeCache.noticeId !== noticeNew.noticeId) {
                    uni.$emit('showNotice')
                    Storage.set('pa_newest_notice', noticeNew)
                }
            }
            func()
            if (state.noticeNewInterval) clearInterval(state.noticeNewInterval)
            state.noticeNewInterval = setInterval(() => {
                func()
            }, 5000)
        }
    }
}
export default business
