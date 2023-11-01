import { commonModel } from '@/api'
import { toast } from './index'

const dicts = {}

export const getDict = key => {
    if (Object.keys(dicts).includes(key)) {
        return dicts[key]
    } else {
        return new Promise((resolve, reject) => {
            commonModel.queryDict({ key }).then(res => {
                if (res.status === 0) {
                    const data = res.data
                    const result = data.map(i => {
                        return {
                            label: i.value,
                            value: i.code
                        }
                    })
                    dicts[key] = result
                    resolve(result)
                } else {
                    toast({ title: res.title })
                    reject()
                }
            })
        })
    }
}
