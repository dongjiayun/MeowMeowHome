<template>
    <pa-container
        ref="container"
        class="pa-mine"
        is-page
        background="#FFAA2C"
        disable-share
    >
        <view class="pa-mine-header">
            <pa-navbar>设置</pa-navbar>
        </view>
        <view class="pa-mine-body">
            <pa-menu
                :data="menu"
                @click="handleMenuClick"
                @chooseAvatar="handleChooseAvatar"
            />
            <view class="pa-mine-body-button" @click="handleLogout">退出登录</view>
        </view>
        <pa-photo-picker ref="avatar" type="image" @choose="handleChoose" />
        <pa-date-popup
            ref="dateSelector"
            start-time="1940/1/1"
            title="选择生日"
            @submit="handleBirthSubmit"
        />
        <pa-area-selector
            ref="areaSelector"
            @submit="handleAreaSubmit"
        />
        <pa-logo
            hide-logo
        />
    </pa-container>
</template>

<script>
import { userModel } from '@/api'
import { mapActions, mapGetters } from 'vuex'
import { logout } from '@/utils/auth'
import dayjs from 'dayjs'
import { getRandomCover } from '@/utils'

export default {
    name: 'Config',
    data() {
        return {
            menu: [
                {
                    label: '头像',
                    prop: 'avatar',
                    func: true,
                    image: getRandomCover(),
                    roundImage: true,
                    openType: 'chooseAvatar'
                },
                {
                    label: '昵称',
                    prop: 'username',
                    text: '匿名猫猫',
                    func: true
                },
                {
                    label: '性别',
                    prop: 'gender',
                    text: '女',
                    func: true
                },
                {
                    label: '生日',
                    prop: 'birthday',
                    text: '请选择生日',
                    func: true
                },
                // {
                //     label: '关联手机',
                //     prop: 'phoneNo',
                //     text: '未绑定',
                //     func: true
                // },
                // {
                //     label: '关联邮箱',
                //     prop: 'email',
                //     text: '未绑定',
                //     func: true
                // },
                // {
                //     label: '注销账号',
                //     prop: 'closeTheAccount',
                //     text: '联系客服处理，注销后无法恢复',
                //     openType: 'contact',
                //     func: true
                // },
                {
                    label: '关于',
                    prop: 'about',
                    text: '🐱 🐱 🐱',
                    func: true
                },
            ],
            ganderOpts: [
                {
                    label: '男',
                    value: '0'
                },
                {
                    label: '女',
                    value: '1'
                },
            ],
            profileData: {}
        }
    },
    async onPullDownRefresh() {
        try {
            await this.init()
        } finally {
            uni.stopPullDownRefresh()
        }
    },
    onShow() {
        this.init()
    },
    computed: {
        ...mapGetters(['cid']),
    },
    methods: {
        ...mapActions(['setAvatar', 'setNickname', 'setGender']),
        init() {
            return this.getProfile()
        },
        async handleChoose(files) {
            const avatarUrl = files?.[0]
            await this.setAvatar(avatarUrl)
            this.getProfile()
        },
        getProfile() {
            userModel.info(this.cid).then(res => {
                if (res.status === 0) {
                    this.profileData = res.data
                    this.setForm()
                } else {
                    this.$toast({ title: res.message })
                }
            })
        },
        setForm() {
            const { avatar, username, gender, phoneNo, birthday, cityInfo } = this.profileData
            const avatarTarget = this.menu[this.$findObj(this.menu, 'avatar')]
            const usernameTarget = this.menu[this.$findObj(this.menu, 'username')]
            const genderTarget = this.menu[this.$findObj(this.menu, 'gender')]
            // const phoneNoTarget = this.menu[this.$findObj(this.menu, 'phoneNo')]
            const birthTarget = this.menu[this.$findObj(this.menu, 'birthday')]
            // const cityTarget = this.menu[this.$findObj(this.menu, 'city')]
            this.$set(avatarTarget, 'image', avatar?.fileUrl || getRandomCover())
            this.$set(usernameTarget, 'text', username || '匿名猫猫')
            const genderEmu = {
                1: '男',
                2: '女',
                3: '保密'
            }
            this.$set(genderTarget, 'text', genderEmu[gender] || '保密')
            // this.$set(phoneNoTarget, 'text', phoneNo || '未绑定')
            // this.$set(phoneNoTarget, 'func', !phoneNo)
            this.$set(birthTarget, 'text', birthday ? dayjs(birthday).format('YYYY年M月D日') : '请选择生日')
            this.$set(birthTarget, 'func', !birthday)
            // this.$set(cityTarget, 'text', cityInfo?.fullAddress || '请选择城市')
        },
        handleMenuClick({ prop }) {
            const emu = {
                'certification': 'www.baidu.com',
                'userAgreement': this.$Config.userPolicy,
                'aftersalePolicy': this.$Config.aftersalePolicy,
                'privacyPolicy': this.$Config.privacyPolicy,
            }
            switch (prop) {
                case 'avatar':
                    // #ifdef H5
                    this.$refs.avatar.open()
                    // #endif
                    break
                case 'username':
                    this.$Router.push({
                        name: 'memberEditNickname',
                        query: {
                            username: this.profileData.username
                        }
                    })
                    break
                case 'gender':
                    this.$refs.container.showActionSheet({
                        opts: [
                            {
                                label: '男',
                                value: '1'
                            },
                            {
                                label: '女',
                                value: '2'
                            },
                            {
                                label: '保密',
                                value: '3'
                            }
                        ],
                        confirm: async gender => {
                            await this.$store.dispatch('setGender', gender)
                            this.getProfile()
                        }
                    })
                    break
                case 'phoneNo':
                    if (this.profileData.phoneNo) {
                        // this.$Router.push({
                        //     name: 'resetPhoneValid'
                        // })
                    } else {
                        this.$Router.push({
                            name: 'login',
                            query: {
                                step: 2
                            }
                        })
                    }
                    break
                case 'certification':
                    this.$Router.push({
                        name: 'certification',
                    })
                    break
                case 'userAgreement':
                    this.$Router.push({
                        name: 'webView',
                        query: {
                            url: emu.userAgreement + `?random=${new Date().getTime()}`
                        }
                    })
                    break
                case 'aftersalePolicy':
                    this.$Router.push({
                        name: 'webView',
                        query: {
                            url: emu.aftersalePolicy + `?random=${new Date().getTime()}`
                        }
                    })
                    break
                case 'privacyPolicy':
                    this.$Router.push({
                        name: 'webView',
                        query: {
                            url: emu.privacyPolicy + `?random=${new Date().getTime()}`
                        }
                    })
                    break
                case 'closeTheAccount':
                    break
                case 'birthday':
                    this.$refs.dateSelector.open(this.profileData?.birthday)
                    break
                case 'city':
                    this.$refs.areaSelector.open(this.profileData?.cityInfo)
                    break
                case 'about':
                    this.$Router.push({
                        name: 'about'
                    })
            }
        },
        handleLogout() {
            this.$refs.container.showDialog({
                content: '确定要退出登录吗',
                confirm: async() => {
                    await logout()
                    this.$Router.redirectTo({ name: 'home' })
                }
            })
        },
        handleChooseAvatar(e) {
            const files = [e?.filePath]
            this.handleChoose(files)
        },
        handleBirthSubmit(date) {
            this.$refs.container.showDialog({
                content: `生日设置后无法编辑,确认要设置为${dayjs(date).format('YYYY-MM-DD')}吗?`,
                confirm: async() => {
                    const params = {
                        cid: this.cid,
                        birthday: dayjs(date)
                    }
                    this.$message.loading()
                    userModel.update(params).then(res => {
                        if (res.status === 0) {
                            this.$toast({ title: '修改成功' })
                            this.getProfile()
                        } else {
                            this.$toast({ title: res.message })
                        }
                    }).finally(() => {
                        this.$message.hide()
                    })
                }
            })
        },
        handleAreaSubmit(value, label) {
            const { province, area, city } = value
            const params = {
                username: this.profileData.username || '匿名猫猫',
                cityInfo: {
                    province,
                    city,
                    area,
                    fullAddress: label.join(' ')
                }
            }
            this.$message.loading()
            userModel.setProfile(params).then(res => {
                if (res.status === 0) {
                    this.$toast({ title: '修改成功' })
                    this.getProfile()
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variable";
.pa-mine{
    &-header{
        z-index: 10;
        background: #FFAA2C;
        position: sticky;
        top: 0;
    }
    &-body{
        padding:16rpx;
        &-button{
            width: 720rpx;
            height: 104rpx;
            background: #FFFFFF;
            border-radius: 16rpx;
            font-size: 30rpx;
            font-weight: 400;
            color: #332C22;
            line-height: 42rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 32rpx;
        }
    }
}
</style>
