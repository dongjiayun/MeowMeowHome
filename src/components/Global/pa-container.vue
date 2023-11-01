<template>
    <view
        class="pa-container"
        :class="{ scrollXHidden }"
        :style="{
            background,
            minHeight: containerHeight,
        }"
    >
        <view v-if="loading" class="pa-container-loading">
            <pa-loading />
        </view>
        <slot v-else />
        <loading-mask v-if="isPage" />
        <tabbar v-if="isPage" />
        <pa-logo v-if="isPage && showLogo" double-bottom-padding />
        <pa-dialog
            ref="dialog"
            :title="title"
            :message="message"
            :cancel-string="cancelText"
            :confirm-string="confirmText"
            :hide-confirm-btm="hideConfirmBtm"
            :is-delete-confirm="isDeleteConfirm"
        />
        <pa-popup
            ref="confirm"
            background="#FFF"
            custom
            no-padding
        >
            <view class="pa-container-confirm">
                <view class="pa-container-confirm-header">
                    {{ message }}
                </view>
                <view class="pa-container-confirm-body" @click="handleSubmit">
                    {{ confirmText }}
                </view>
                <view class="pa-container-confirm-footer" @click="handleCancel">
                    {{ cancelText }}
                </view>
            </view>
        </pa-popup>
        <pa-action-sheet ref="actionSheet" :opts="opts" @choose="handleActionSheet" />
        <pa-preview-image
            ref="previewImage"
            :imgs="previewImageImgs"
            :descs="previewImageDescs"
            @swiperChange="handlePreviewSwiperChange"
        />
    </view>
</template>

<script>
import LoadingMask from '@/components/loadingMask'
import tabbar from '../tabbar'

export default {
    name: 'PaContainer',
    components: { LoadingMask, tabbar },
    props: {
        background: String,
        isPage: Boolean,
        showLogo: Boolean,
        shareCover: String,
        shareTitle: String,
        disableShare: Boolean,
        useOriginCover: Boolean,
        shareQueryBlackList: {
            type: Array,
            default: () => []
        },
        scrollXHidden: Boolean
    },
    data() {
        return {
            loading: false,
            loadingSize: 'normal',
            title: '',
            message: '',
            confirmText: '',
            cancelText: '',
            confirmCallback: undefined,
            cancelCallback: undefined,
            opts: [],
            actionSheetConfirm: undefined,
            hideConfirmBtm: undefined,
            previewImageImgs: [],
            previewImageDescs: [],
            isDeleteConfirm: false
        }
    },
    computed: {
        containerHeight() {
            return this.isPage ? '100vh' : undefined
        }
    },
    watch: {
        shareCover() {
            this.setShare()
        },
        shareTitle() {
            this.setShare()
        },
        disableShare: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.handleDisableShare()
                } else {
                    this.handleEnableShare()
                }
            }
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        uni.$off('previewImage')
        uni.$off('closePreviewImage')
    },
    methods: {
        init() {
            if (this.isPage) {
                this.setShare()
                // console.log('this.isPage')
                uni.$on('previewImage', this.previewImage)
                uni.$on('closePreviewImage', this.$refs.previewImage.close)
            }
        },
        handleEnableShare() {
            if (this.isPage) {
                uni.showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline'],
                })
                this.setShare()
            }
        },
        handleDisableShare() {
            if (this.isPage) {
                uni.hideShareMenu()
            }
        },
        setShare() {
            const title = this.shareTitle || '盟宠星球纪'
            const imageUrl = this.useOriginCover ? '' : (this.shareCover || 'https://qa-res.ipetapi.com/miniprogram/mall/static/share.png')
            const query = this.$Router.getCurrentRouteQuery()
            this.shareQueryBlackList.forEach(i => {
                delete query[i]
            })
            // console.log('query', query)
            const path = this.$Router.resolve({
                name: this.$Router.getCurrentRouteName(),
                query
            })
            const pages = getCurrentPages()
            const view = pages[pages.length - 1]
            view.onShareAppMessage = () => {
                return {
                    title,
                    imageUrl,
                    path,
                }
            }
        },
        showLoading(size) {
            this.loadingSize = size || 'normal'
            this.loading = true
        },
        hideLoading() {
            this.loading = false
        },
        showDialog(data) {
            const { title, content, confirm, confirmText, cancelText, cancel, hideConfirmBtm, isDeleteConfirm } = data
            this.title = title || ''
            this.message = content || ''
            this.confirmText = confirmText || '确认'
            this.cancelText = cancelText || '取消'
            this.hideConfirmBtm = hideConfirmBtm || false
            this.isDeleteConfirm = !!isDeleteConfirm
            this.$refs.dialog.open(confirm, cancel)
        },
        showConfirm(data) {
            const { content, confirm, cancel, confirmText, cancelText } = data
            this.message = content
            this.confirmText = confirmText || '确认'
            this.cancelText = cancelText || '取消'
            this.confirmCallback = confirm
            this.cancelCallback = cancel
            this.$refs.confirm.open()
        },
        handleSubmit() {
            if (this.confirmCallback) this.confirmCallback()
            this.$refs.confirm.close()
        },
        handleCancel() {
            if (this.cancelCallback) this.cancelCallback()
            this.$refs.confirm.close()
        },
        showActionSheet(data) {
            const { confirm, opts } = data
            this.actionSheetConfirm = confirm
            this.opts = opts
            this.$refs.actionSheet.open()
        },
        handleActionSheet(value) {
            this.actionSheetConfirm(value)
        },
        previewImage({ images, descs, index }) {
            console.log('previewImage')
            this.previewImageImgs = images || []
            this.previewImageDescs = descs || []
            this.$nextTick(() => {
                this.$refs.previewImage.open(index)
            })
        },
        handlePreviewSwiperChange(index) {
            this.$emit('previewSwiperChange', index)
            uni.$emit('previewSwiperChange', index)
        }
    }
}
</script>
<style scoped lang="scss">
    .pa-container{
        //width: 100vw;
        //overflow-x: hidden;
        position: relative;
        &.scrollXHidden{
            overflow-x:hidden;
            width: 100%;
        }
        &.disablePageScroll{
            height: 100vh;
            overflow: hidden;
        }
        &-loading{
            position: fixed;
            left: 50%;
            top:50%;
            transform: translate(-50%,-50%);
            z-index: 100;
            &.normal{
                width: 160rpx;
                height: 160rpx;
            }
            &.medium{
                width: 120rpx;
                height: 120rpx;
            }
            &.small{
                width: 90rpx;
                height: 90rpx;
            }
            &.mini{
                width: 60rpx;
                height: 60rpx;
            }
            &.isPage{
                position: relative;
            }
        }
        &-confirm{
            background: #F2F2F2;
            &-header{
                padding:40rpx 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1rpx solid #F2F2F2;
                background: #fff;
                font-size: 28rpx;
                font-weight: 400;
                color: #aaa;
            }
            &-body{
                padding:40rpx 0;
                font-size: 32rpx;
                font-weight: 400;
                color: #F28900;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 16rpx;
            }
            &-footer{
                padding:32rpx 0 ;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 34rpx;
                font-weight: 400;
                color: #000000;
                background: #fff;
             }
        }
    }
</style>

