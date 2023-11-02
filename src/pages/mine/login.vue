<template>
    <pa-container
        ref="container"
        is-page
        disable-share
    >
        <view class="pa-login">
            <view class="pa-login-header">
                <pa-navbar
                    custom-back
                    custom-home
                    @home="handleHome"
                    @back="handleBack"
                />
            </view>
            <view class="pa-login-body">
                <button
                    v-if="step === 1"
                    open-type="agreePrivacyAuthorization"
                    class="pa-mall-button"
                    @bindagreeprivacyauthorization="handleAgreePrivacyAuthorization"
                    @click="handleLogin"
                >一键登录</button>
                <button
                    v-if="step === 2"
                    class="pa-mall-button"
                    open-type="getPhoneNumber"
                    @getphonenumber="handleGetMobile"
                >获取手机号</button>
                <view
                    v-if="step === 1"
                    class="pa-login-body-policy"
                    @click="handleAgree"
                >
                    <view style="margin-right: 10rpx">
                        <pa-checkbox :size="28" :value="agree" />
                    </view>
                    <view class="pa-login-body-policy-text">
                        <text>我已同意</text>
                        <text class="pa-login-body-policy-text-orange" @click.stop="handleGoToPolicy('member')">《盟宠星球用户协议》</text>
                        <text>、</text>
                        <text class="pa-login-body-policy-text-orange" @click.stop="handleGotoPrivacyPolicy">《隐私协议》</text>
                    </view>
                </view>
            </view>
        </view>
    </pa-container>
</template>

<script>
import { login } from '@/utils/auth'
import { authModel, userModel } from '@/api'
import PaCheckbox from '@/components/Global/pa-checkbox.vue'

export default {
    name: 'Login',
    components: { PaCheckbox },
    onLoad({ step, isFromCheckLogin }) {
        if (step) {
            this.step = parseInt(step)
            if (this.step === 2) {
                this.isLoginSuccess = true
            }
        }
        if (isFromCheckLogin) {
            this.isFromCheckLogin = isFromCheckLogin
        }
        wx.onNeedPrivacyAuthorization(resolve => {
            this.resolvePrivacyAuthorization = resolve
        })
    },
    data() {
        return {
            step: 1,
            isLoginSuccess: false,
            isFromCheckLogin: false,
            agree: false,
            resolvePrivacyAuthorization: undefined
        }
    },
    onHide() {
        if (!this.isLoginSuccess) this.$store.dispatch('logout')
    },
    methods: {
        async handleLogin() {
            if (!this.agree) {
                return this.$toast({ title: '请同意盟宠星球用户协议和隐私协议' })
            }
            const hasPhoneNo = await login()
            this.isLoginSuccess = true
            this.$store.dispatch('setUserInfo')
            if (hasPhoneNo) {
                if (this.isFromCheckLogin) {
                    this.$Router.back()
                } else {
                    this.$store.dispatch('retryLastPage')
                }
            } else {
                this.step = 2
            }
        },
        async handleGetMobile({ detail }) {
            const { errMsg } = detail
            if (errMsg.includes('deny')) {
                this.$toast({ title: '欢迎您的到来,您稍后可以在设置中重新绑定手机' })
                setTimeout(() => {
                    if (this.isFromCheckLogin) {
                        this.$Router.back()
                    } else {
                        this.$store.dispatch('retryLastPage')
                    }
                }, 1500)
                return
            }
            const { code: authCode } = detail
            if (!authCode) {
                this.$toast({ title: '您稍后可以在设置中重新绑定手机' })
                setTimeout(() => {
                    if (this.isFromCheckLogin) {
                        this.$Router.back()
                    } else {
                        this.$store.dispatch('retryLastPage')
                    }
                }, 1500)
                return
            }
            this.$message.loading()
            authModel.getPhoneNo({ authCode }).then(res => {
                if (res.status === 0) {
                    const phoneNo = res.data
                    this.$message.loading()
                    userModel.bindPhoneNo({ phoneNo }).then(async res => {
                        if (res.status === 0) {
                            const { merged } = res.data
                            if (merged) {
                                const { cid, jwtToken, platNo, openId, unionId, refreshToken, phoneNo } = res.data.replaceIdentity
                                await this.$store.dispatch('login', {
                                    token: jwtToken,
                                    platNo,
                                    openId,
                                    unionId,
                                    refreshToken,
                                    cid,
                                    phoneNo
                                })
                            } else {
                                await this.$store.dispatch('setPhoneNo', phoneNo)
                            }
                            if (this.isFromCheckLogin) {
                                this.$Router.back()
                            } else {
                                this.$store.dispatch('retryLastPage')
                            }
                        } else {
                            this.$toast({ title: res.message })
                        }
                    }).finally(() => {
                        this.$message.hide()
                    })
                } else {
                    this.$toast({ title: res.message })
                }
            }).catch(() => {
                this.$message.hide()
            })
        },
        handleGoToPolicy(type) {
            const emu = {
                'member': this.$Config.userPolicy,
                'privacy': this.$Config.privacyPolicy,
            }
            this.$Router.push({
                name: 'webView',
                query: {
                    url: emu[type]
                }
            })
        },
        handleGotoPrivacyPolicy() {
            wx.openPrivacyContract()
        },
        handleHome() {
            if (this.isLoginSuccess) {
                this.$Router.redirectTo({ name: 'home' })
            } else {
                this.$store.dispatch('logout').then(() => {
                    this.$Router.redirectTo({ name: 'home' })
                })
            }
        },
        handleBack() {
            if (this.isLoginSuccess) {
                this.$Router.back()
            } else {
                this.$store.dispatch('logout').then(() => {
                    this.$Router.back()
                })
            }
        },
        handleAgree() {
            this.agree = !this.agree
        },
        handleAgreePrivacyAuthorization() {
            this.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })
        }
    }
}
</script>

<style lang="scss" scoped>
    .pa-login{
        background: url(https://res.ipetapi.com/miniprogram/mall/bg_login.jpg) no-repeat center/cover;
        height: 100vh;
        &-header{
            z-index: 10;
            position: sticky;
            top: 0;
        }
        &-body{
            padding:72rpx;
            margin-top: 65vh;
            &-policy{
                margin-top: 24rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                &-text{
                    font-size: 24rpx;
                    font-weight: 400;
                    color: rgba(0,0,0,0.5);
                    line-height: 34rpx;
                    &-orange{
                        color:#F28900;
                    }
                }
            }
        }
    }
</style>
