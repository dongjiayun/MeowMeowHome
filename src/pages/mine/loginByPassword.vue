<template>
    <pa-container is-page>
        <view class="pa-login">
            <view class="pa-login-header">
                <pa-navbar />
            </view>
            <view class="pa-login-body">
                <pa-form
                    ref="form"
                    has-division
                    :forms="forms"
                />
                <view style="margin-top: 40rpx">
                    <button class="pa-mall-button" @click="handleLogin">立即登录</button>
                </view>
            </view>
        </view>
    </pa-container>
</template>

<script>
import { Email } from '@/utils/valids'
import { authModel } from '@/api'
import { login } from '@/utils/auth'

export default {
    data() {
        return {
            forms: [
                {
                    type: 'input',
                    label: '邮箱',
                    prop: 'email',
                    placeholder: '请输入邮箱',
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
                    type: 'input',
                    inputType: 'password',
                    label: '密码',
                    prop: 'password',
                    placeholder: '请输入密码',
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入密码'
                        },
                    ]
                }
            ]
        }
    },
    methods: {
        async handleLogin() {
            const { email, password } = await this.$refs.form.validate()
            const params = {
                email,
                password,
                loginType: 'emailWithPassword'
            }
            await login('password', params)
            this.$store.dispatch('setUserInfo')
            if (this.isFromCheckLogin) {
                this.$Router.back()
            } else {
                this.$store.dispatch('retryLastPage')
            }
        }
    }
}
</script>

<style scoped lang="scss">
.pa-login{
    height: 100vh;
    background: url("https://qa-res.ipetapi.com/meowmeowmeow/cat1.gif") no-repeat bottom/cover;
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
    }
    &-body{
        padding: 16rpx;
        margin-top: 60vh;
    }
}
</style>
