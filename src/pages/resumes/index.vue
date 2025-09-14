<script lang="ts">
import Vue from 'vue'
import markdown from '@/components/markdown.vue'
import { resumeModel } from '@/api'
import { MD5 } from 'crypto-js'

export default Vue.extend({
    name: 'Index',
    components: { markdown },
    data() {
        return {
            resumes: [],
            resume: '',
            lang: 'zh',
            resumeKey: 'djy123',
            password: '',
            hasAccess: false
        }
    },
    async mounted() {
        await this.getResumes()
        this.setResume()
    },
    onLoad(query) {
        if (query.lang) {
            this.lang = query.lang
        }
        if (query.password) {
            this.password = query.password
        }
    },
    methods: {
        async getResumes() {
            await this.checkPassword()
            const params = {
                isLatest: true,
            }
            this.$message.loading()
            return resumeModel.list(params).then(res => {
                if (res.status === 0) {
                    this.resumes = res?.data.list || []
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        setResume() {
            this.resume = this.resumes.find(i => this.lang === i.language).content ?? ''
        },
        handleSwitchLanguage() {
            this.lang = this.lang === 'zh' ? 'en' : 'zh'
            this.setResume()
        },
        checkPassword() {
            return new Promise((resolve, reject) => {
                const password = MD5(this.resumeKey).toString()
                if (this.password && (this.password === password || this.password === 'SpecialPrivilege')) {
                    this.hasAccess = true
                    resolve()
                } else {
                    this.hasAccess = false
                    reject()
                }
            })
        }
    }
})
</script>

<template>
    <pa-container ref="container" is-page>
        <view class="pa-resume">
            <view class="pa-resume-header">
                <pa-navbar>{{ lang === 'zh' ? '简历' : 'resumes' }}</pa-navbar>
            </view>
            <view class="pa-resume-main">
                <markdown
                    v-if="hasAccess"
                    :content="resume"
                />
                <view v-else class="alert">很抱歉您没有访问权限,请联系董先生获取权限</view>
            </view>
            <pa-footer v-if="hasAccess">
                <button class="pa-mall-button" @click="handleSwitchLanguage">{{ lang === 'zh' ? '切换为英语' : 'switch to Chinese' }} </button>
            </pa-footer>
        </view>
    </pa-container>
</template>

<style scoped lang="scss">
.pa-resume{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
        background: #fff;
    }
    &-main{
        margin-bottom: 120rpx;
        .alert{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 80vh;
            font-size: 32rpx;
        }
    }
}
</style>
