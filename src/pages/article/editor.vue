<template>
    <pa-container is-page>
        <view class="pa-article-editor">
            <view class="pa-article-editor-header">
                <pa-navbar>{{ isEdit ? '编辑' : '写小作文' }}</pa-navbar>
            </view>
            <view class="pa-article-editor-body">
                <pa-form
                    ref="form"
                    :forms="forms"
                />
                <mp-editor
                    ref="article"
                    domain="https://qa-res.ipetapi.com"
                    editable
                />
            </view>
            <pa-footer>
                <button class="pa-mall-button" @click="handleSubmit">提交 </button>
            </pa-footer>
        </view>
        <pa-logo hide-logo double-bottom-padding />
    </pa-container>
</template>

<script >
import mpEditor from '@/components/mp-html/index.vue'
import { articleModel } from '@/api'
export default {
    components: { mpEditor },
    data() {
        return {
            data: {},
            articleId: '',
            content: '',
            forms: [
                {
                    type: 'input',
                    inputType: 'text',
                    label: '标题',
                    prop: 'title',
                    placeholder: '请输入标题',
                    maxlength: 20,
                    showWordLimit: true,
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入标题'
                        },
                    ]
                },
                {
                    type: 'uploadImages',
                    label: '靓照(s)',
                    prop: 'covers',
                    mediaType: 'image',
                    number: 9,
                    info: '多发靓照哦~,第一张默认为文章封面~,不传的话会随机分配一张',
                }
            ]
        }
    },
    onLoad({ articleId }) {
        this.articleId = articleId
    },
    computed: {
        isEdit() {
            return !!this.articleId
        }
    },
    onShow() {
        this.init()
    },
    methods: {
        init() {
            if (this.isEdit) {
                this.getDetail()
            }
        },
        getDetail() {
            articleModel.get(this.articleId).then(res => {
                if (res.status === 0) {
                    this.data = res.data
                    const { title, covers, content } = this.data
                    this.$nextTick(() => {
                        this.$refs.form.init({
                            title,
                            covers: covers.map(i => i.fileUrl)
                        })
                        this.$refs.article.init(content)
                    })
                }
            })
        },
        async handleSubmit() {
            const { title, covers } = await this.$refs.form.validate()
            this.$refs.article.save(content => {
                const params = {
                    content,
                    title,
                    covers: covers.map(i => ({ fileUrl: i }))
                }
                if (this.isEdit) {
                    params.articleId = this.articleId
                }
                this.$message.loading()
                articleModel[this.isEdit ? 'edit' : 'create'](params).then(res => {
                    if (res.status === 0) {
                        const articleId = res.data
                        this.$toast({ title: this.isEdit ? '修改成功' : '发布成功' })
                        setTimeout(() => {
                            if (this.isEdit) {
                                this.$router.back()
                            } else {
                                this.$Router.redirectTo({
                                    name: 'articleDetail',
                                    query: {
                                        articleId
                                    }})
                            }
                        }, 1000)
                    } else {
                        this.$toast({ title: res.message })
                    }
                }).finally(() => {
                    this.$message.hide()
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.pa-article-editor{
    &-header{
        z-index: 10;
        position: sticky;
        top: 0;
        background: #F5F5F5;
    }
    &-body{
        padding:16rpx;
    }
}
</style>
