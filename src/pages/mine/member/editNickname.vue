<template>
    <pa-container
        ref="container"
        class="pa-mine-edit-nickname"
        is-page
        background="#FFFFFF"
        disable-share
    >
        <view class="pa-mine-edit-nickname-header">
            <pa-navbar>编辑昵称</pa-navbar>
        </view>
        <view class="pa-mine-edit-nickname-body">
            <pa-form
                ref="form"
                :forms="forms"
            />
            <button
                style="margin-top: 32rpx"
                class="pa-mall-button"
                @click="handleSubmit"
            >保 存</button>
        </view>
    </pa-container>
</template>

<script>
import { ChineseEnglishAndNumber } from '@/utils/valids'

export default {
    name: 'EditNickname',
    onLoad({ username }) {
        if (username) this.username = decodeURIComponent(username)
    },
    data() {
        return {
            username: '',
            forms: [
                {
                    type: 'input',
                    inputType: 'nickname',
                    prop: 'username',
                    placeholder: '请填写昵称',
                    maxlength: 20,
                    subtitle: '最多20个字符，可由中文、英文、数字组成',
                    rules: [
                        {
                            required: true,
                            errorMessage: '请填写昵称'
                        },
                        {
                            pattern: ChineseEnglishAndNumber,
                            errorMessage: '请输入中文、英文、数字'
                        }
                    ]
                }
            ],
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.form.init({ username: this.username })
        })
    },
    methods: {
        async handleSubmit() {
            const { username } = await this.$refs.form.validate()
            this.$message.loading()
            this.$store.dispatch('setNickname', username).then(res => {
                this.$Router.back()
            }).finally(() => {
                this.$message.hide()
            })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variable";
.pa-mine-edit-nickname{
    &-header{
        z-index: 10;
        background: #FFAA2C;
        position: sticky;
        top: 0;
    }
    &-body{
        margin: 16rpx;
    }
}
</style>
