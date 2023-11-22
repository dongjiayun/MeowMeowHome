<template>
    <pa-container
        ref="container"
        class="pa-mine-edit-nickname"
        is-page
        background="#FFFFFF"
        disable-share
    >
        <view class="pa-mine-edit-nickname-header">
            <pa-navbar>重置密码</pa-navbar>
        </view>
        <view class="pa-mine-edit-nickname-body">
            <pa-form
                ref="form"
                :forms="forms"
                @getSmscode="handleGetSmscode"
            />
            <button
                style="margin-top: 32rpx"
                class="pa-mall-button"
                @click="handleSubmit"
            >提 交</button>
        </view>
    </pa-container>
</template>

<script>
import { Email, Password } from '@/utils/valids'
import { authModel } from '@/api'
import { logout } from '@/utils/auth'

export default {
    name: 'EditNickname',
    onLoad({ username }) {
        if (username) this.username = decodeURIComponent(username)
    },
    data() {
        return {
            username: '',
            ticket: '',
            forms: [
                {
                    type: 'input',
                    inputType: 'text',
                    prop: 'email',
                    label: '邮箱',
                    placeholder: '请填写邮箱',
                    rules: [
                        {
                            required: true,
                            errorMessage: '请填写老密码'
                        },
                        {
                            pattern: Email,
                            errorMessage: '请填写正确的邮箱'
                        }
                    ]
                },
                {
                    type: 'smscode',
                    label: '验证码',
                    adjustPosition: false,
                    prop: 'smscode',
                    placeholder: '请输入验证码',
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入验证码'
                        },
                    ]
                },
                {
                    type: 'input',
                    inputType: 'password',
                    prop: 'newPassword',
                    label: '新密码',
                    placeholder: '请填写新密码',
                    maxlength: 20,
                    subtitle: '大于6个字符,可由符号、英文、数字组成,必须包含数字和英文',
                    rules: [
                        {
                            required: true,
                            errorMessage: '请填写新密码'
                        },
                        {
                            pattern: Password,
                            errorMessage: '密码格式不正确'
                        }
                    ]
                },
                {
                    type: 'input',
                    inputType: 'password',
                    label: '确认新密码',
                    prop: 'repeatpassword',
                    placeholder: '请确认新密码',
                    maxlength: 20,
                    rules: [
                        {
                            required: true,
                            errorMessage: '请确认新密码'
                        },
                    ]
                }
            ],
        }
    },
    methods: {
        async handleSubmit() {
            const { email, smscode, newPassword, repeatpassword } = await this.$refs.form.validate()
            if (newPassword !== repeatpassword) {
                return this.$toast({ title: '两次密码不一致' })
            }
            const params = {
                email,
                smscode,
                password: newPassword,
                ticket: this.ticket
            }
            authModel.findbackPassword(params).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '修改成功,请重新登陆~' })
                    setTimeout(async() => {
                        try {
                            await logout()
                        } finally {
                            this.$Router.redirectTo({ name: 'home' })
                        }
                    }, 1000)
                } else {
                    this.$toast({ title: res.message })
                }
            })
        },
        async handleGetSmscode(prop, callback) {
            const { email } = await this.$refs.form.validateField(['email'])
            if (!email) return this.$toast({ title: '请填写邮箱' })
            const params = {
                email
            }
            this.$message.loading()
            authModel.sendEmailOtp(params).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '验证码已发送' })
                    this.ticket = res.data
                    callback(prop)
                } else {
                    this.$toast({ title: res.message })
                }
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
