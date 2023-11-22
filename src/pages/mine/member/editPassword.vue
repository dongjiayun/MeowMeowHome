<template>
    <pa-container
        ref="container"
        class="pa-mine-edit-nickname"
        is-page
        background="#FFFFFF"
        disable-share
    >
        <view class="pa-mine-edit-nickname-header">
            <pa-navbar>修改密码</pa-navbar>
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
            >提 交</button>
        </view>
    </pa-container>
</template>

<script>
import { Password } from '@/utils/valids'
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
            forms: [
                {
                    type: 'input',
                    inputType: 'password',
                    prop: 'password',
                    placeholder: '请填写老密码',
                    subtitle: '默认密码为 123456',
                    maxlength: 20,
                    rules: [
                        {
                            required: true,
                            errorMessage: '请填写老密码'
                        },
                    ]
                },
                {
                    type: 'input',
                    inputType: 'password',
                    prop: 'newPassword',
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
            const { password, newPassword, repeatpassword } = await this.$refs.form.validate()
            if (newPassword !== repeatpassword) {
                return this.$toast({ title: '两次密码不一致' })
            }
            const params = {
                password,
                newPassword
            }
            authModel.resetPassword(params).then(res => {
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
        }
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
