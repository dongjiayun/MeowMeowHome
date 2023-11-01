<template>
    <pa-action-sheet ref="photoSource" :opts="photoSource" @choose="sourceSubmit" />
</template>

<script>
import { upload } from '@/utils/obs'
export default {
    name: 'PaPhotoPicker',
    props: {
        count: {
            type: Number,
            default: 1
        },
        type: {
            type: String,
            default: 'all'
        },
        module: {
            type: String,
            default: 'default'
        },
        extension: Array,
    },
    computed: {
        photoSource() {
            let source = []
            switch (this.type) {
                case 'all':
                    source = [
                        { label: '从相册选择图片', value: 'album-image' },
                        { label: '拍照', value: 'camera-image' },
                        { label: '从相册选择视频', value: 'album-video' },
                        { label: '拍摄视频', value: 'camera-video' },
                    ]
                    break
                case 'image':
                    source = [
                        { label: '从相册选择图片', value: 'album-image' },
                        { label: '拍照', value: 'camera-image' },
                    ]
                    break
                case 'video':
                    source = [
                        { label: '从相册选择视频', value: 'album-video' },
                        { label: '拍摄视频', value: 'camera-video' },
                    ]
            }
            return source
        }
    },
    methods: {
        open() {
            const vm = this
            if (this.photoSource.length === 1) {
                uni[this.type === 'image' ? 'chooseImage' : 'chooseVideo']({
                    count: this.count,
                    sourceType: ['album'],
                    compressed: false,
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    success: async res => {
                        const files = this.type === 'image' ? res.tempFiles : [{ path: res.tempFilePath }]
                        vm.uploadHandle(files)
                    }
                })
            } else {
                this.$refs.photoSource.open()
            }
        },
        sourceSubmit(value) {
            const [sourceType, mediaType] = value.split('-')
            const vm = this
            uni[mediaType === 'image' ? 'chooseImage' : 'chooseVideo']({
                count: this.count,
                sourceType: [sourceType],
                compressed: false,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                success: async res => {
                    vm.$refs?.photoSource.close()
                    const files = mediaType === 'image' ? res.tempFiles : [{ path: res.tempFilePath }]
                    vm.uploadHandle(files)
                },
                fail(e) {
                    vm.$consoleLog('chooseImageError:' + JSON.stringify(e))
                }
            })
        },
        async uploadHandle(file) {
            let files = []
            const loads = []
            const limit = 50 * 1024 * 1024
            let hasExceotionFile = false
            if (this.extension && this.extension.length > 0) {
                file.forEach(url => {
                    let count = 0
                    if (this.extension.some(ext => {
                        return url.path.toLowerCase().includes(ext)
                    })) {
                        count++
                    }
                    if (count === 0) {
                        hasExceotionFile = true
                    }
                })
                file = file.filter(i => {
                    return this.extension.some(except => {
                        return i.path.toLowerCase().includes(except)
                    })
                })
            }
            if (hasExceotionFile) {
                return this.$toast({ title: `请上传${this.extension.join(',')}格式的文件` })
            }
            file.forEach(i => {
                if (i.size > limit) {
                    return this.$toast({ title: '文件太大' })
                }
                loads.push(upload({
                    data: i,
                    module: this.module,
                }))
            })
            await Promise.all(loads).then(res => {
                files = res.map(i => i.filePath)
            })
            this.$emit('choose', files)
        }
    }
}
</script>
