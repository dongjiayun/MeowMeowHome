<template>
    <pa-container
        disable-share
        is-page
    >
        <view class="pa-login">
            <view class="pa-login-header">
                <pa-navbar />
            </view>
            <view class="pa-login-body">
                <view class="pa-login-body-title">邮箱登录喵喵喵</view>
                <pa-form
                    ref="form"
                    :forms="forms"
                    @getSmscode="handleGetSmscode"
                />
                <view class="pa-login-body-signup" @click="handleSignup">已有账号?直接使用邮箱密码登录! -></view>
                <view style="margin-top: 40rpx">
                    <button class="pa-mall-button" @click="handleLogin">立即注册/登陆</button>
                </view>
            </view>
        </view>
    </pa-container>
</template>

<script>
import { Email } from '@/utils/valids'
import { login } from '@/utils/auth'
import { authModel } from '@/api'
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['token'])
    },
    onShow() {
        if (this.token) {
            this.$Router.redirectTo({ name: 'home' })
        }
    },
    data() {
        return {
            forms: [
                {
                    type: 'input',
                    label: '邮箱',
                    prop: 'email',
                    placeholder: '请输入邮箱',
                    adjustPosition: false,
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入邮箱'
                        },
                        {
                            pattern: Email,
                            errorMessage: '请输入正确的'
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
                }
            ],
            ticket: '',
        }
    },
    methods: {
        async handleLogin() {
            const { email, smscode } = await this.$refs.form.validate()
            const params = {
                email,
                otp: smscode,
                loginType: 'email',
                ticket: this.ticket
            }
            await login('email', params)
            this.$store.dispatch('setUserInfo')
            if (this.isFromCheckLogin) {
                this.$Router.back()
            } else {
                this.$store.dispatch('retryLastPage')
            }
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
        handleSignup() {
            this.$Router.push({
                name: 'loginByPassword'
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-login{
    height: 100vh;
    background: url("https://qa-res.ipetapi.com/meowmeowmeow/cat2.gif") no-repeat bottom/cover;
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
    }
    &-body{
        padding: 16rpx;
        margin-top: 40vh;
        &-title{
            margin-bottom: 5vh;
            font-size: 60rpx;
            color: #fff;
            font-weight: bolder;
            text-align: center;
        }
        &-signup{
            text-align: right;
            color: #fff;
        }
    }
}
</style>
