<template>
    <pa-container
        is-page
        disable-share
    >
        <view class="pa-login">
            <view class="pa-login-header">
                <pa-navbar />
            </view>
            <view class="pa-login-body">
                <template v-if="loginType === 'emailWithPassword'">
                    <view class="pa-login-body-title">登陆喵喵喵</view>
                    <pa-form
                        ref="form"
                        :forms="forms"
                    />
                    <view class="pa-login-body-signup" @click="handleSignup">无账号?直接使用邮箱登录! -></view>
                    <view style="margin-top: 40rpx">
                        <button class="pa-mall-button" @click="handleLogin">立即登录</button>
                    </view>
                </template>
                <template v-else-if="loginType === 'wechat'">
                    <view class="pa-login-body-title">快来玩!</view>
                    <view style="margin-top: 40rpx">
                        <button class="pa-mall-button" @click="handleLogin">一键登录</button>
                    </view>
                </template>
                <!-- #ifdef  MP-WEIXIN -->
                <view class="pa-login-body-other">其他登录方式</view>
                <view class="pa-login-body-buttons">
                    <view v-if="loginType !== 'emailWithPassword'" class="pa-login-body-buttons-button" @click="loginType = 'emailWithPassword'">
                        <uni-icons
                            color="#fff"
                            type="email-filled"
                            size="30"
                        />
                    </view>
                    <view v-if="loginType !== 'wechat'" class="pa-login-body-buttons-button" @click="loginType = 'wechat'">
                        <uni-icons
                            color="#fff"
                            type="weixin"
                            size="30"
                        />
                    </view>
                </view>
                <!-- #endif -->
            </view>
        </view>
    </pa-container>
</template>

<script>
import { Email } from '@/utils/valids'
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
                    type: 'input',
                    inputType: 'password',
                    label: '密码',
                    prop: 'password',
                    placeholder: '请输入密码',
                    adjustPosition: false,
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入密码'
                        },
                    ]
                }
            ],
            // #ifdef  MP-WEIXIN
            loginType: 'wechat',
            // #endif
            // #ifdef  H5
            loginType: 'emailWithPassword',
            // #endif
        }
    },
    methods: {
        async handleLogin() {
            const params = {
                loginType: this.loginType
            }
            if (this.loginType === 'emailWithPassword') {
                const { email, password } = await this.$refs.form.validate()
                params.email = email
                params.password = password
            }
            await login(this.loginType, params)
            this.$store.dispatch('setUserInfo')
            if (this.isFromCheckLogin) {
                this.$Router.back()
            } else {
                this.$store.dispatch('retryLastPage')
            }
        },
        handleSignup() {
            this.$Router.push({
                name: 'signUp'
            })
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
        margin-top: 35vh;
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
        &-other{
            font-size: 32rpx;
            color: #fff;
            font-weight: bolder;
            text-align: center;
            margin-top: 30rpx;
        }
        &-buttons{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 20rpx;
            &-button{
                width: 80rpx;
                height: 80rpx;
                border-radius: 80rpx;
                background: #FFAA2C;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}
</style>
