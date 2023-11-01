<template>
    <pa-container
        ref="container"
        is-page
        background="#F5F5F5"
        scroll-x-hidden
        use-origin-cover
    >
        <view class="pa-home-page">
            <pa-status-bar />
            <view class="pa-home-page-header">
                <image :src="require('./assets/logo.png')" class="pa-home-page-header-logo" />
            </view>
            <template v-if="whiteList">
                <view v-if="construction && construction.length > 0" class="pa-home-page-main">
                    <view
                        v-for="(item,index) in construction"
                        :key="index"
                        class="pa-home-page-main-item"
                    >
                        <template v-if="checkNodeAvaliable(item)">
                            <pet-store-header
                                v-if="item.type === 'swiperNode'"
                                ref="node"
                                class="homeNode"
                            />
                            <promotion
                                v-if="item.type === 'seckillNode'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <recommend
                                v-if="item.type === 'recommendNode'"
                                id="home-recommend-node"
                                ref="node"
                                class="homeNode"
                                hide-logo
                            />
                            <single-image
                                v-if="item.type === 'singleImageNode'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <double-image
                                v-if="item.type === 'douImageNode' "
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <trible-image
                                v-if="item.type === 'triImageNode'"
                                ref="node"
                                :data="item"
                                class="homeNode"
                            />
                            <trible-image-type-b
                                v-if="item.type === 'triImageNodeTypeB'"
                                ref="node"
                                :data="item"
                                class="homeNode"
                            />
                            <video-node
                                v-if="item.type === 'videoNode'"
                                ref="node"
                                :data="item"
                                class="homeNode"
                            />
                            <swiper-node
                                v-if="item.type === 'commonSwiperNode'"
                                ref="node"
                                :data="item"
                                class="homeNode"
                            />
                            <brand-introduction
                                v-if="item.type === 'brandIntroductionNode'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <member-node
                                v-if="item.type === 'memberNode'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <pets-node
                                v-if="item.type === 'petsNode'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <product-column1
                                v-if="item.type === 'productColumn1Node'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <product-column2
                                v-if="item.type === 'productColumn2Node'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                            <product-column3
                                v-if="item.type === 'productColumn3Node'"
                                ref="node"
                                class="homeNode"
                                :data="item"
                            />
                        </template>
                    </view>
                    <home-block
                        v-for="(item,index) in hotspots"
                        :key="index"
                        :hotspot-offset-height="hotspotOffsetHeight"
                        :data="item"
                    />
                </view>
            </template>
            <pa-logo
                double-bottom-padding
            />
            <join-popup ref="joinPopup" />
            <level-up-popup ref="levelUpPopup" />
            <sign-in-popup ref="signInPopup" />
        </view>
    </pa-container>
</template>

<script>
import PetStoreHeader from '@/components/mall/nodes/header.vue'
import promotion from '@/components/mall/nodes/promotion.vue'
import recommend from '@/components/mall/recommend'
import { mapGetters } from 'vuex'
import singleImage from '@/components/mall/nodes/singleImage.vue'
import doubleImage from '@/components/mall/nodes/doubleImage.vue'
import tribleImage from '@/components/mall/nodes/tribleImage.vue'
import tribleImageTypeB from '@/components/mall/nodes/tribleImageTypeB.vue'
import videoNode from '@/components/mall/nodes/videoNode.vue'
import swiperNode from '@/components/mall/nodes/swiperNode.vue'
import brandIntroduction from '@/components/mall/nodes/brandIntroduction.vue'
import { viewModel, ruleModel } from '@/api'
import { uniq } from 'lodash'
import HomeBlock from '@/components/mall/nodes/block.vue'
import joinPopup from '@/components/mall/member/joinPopup.vue'
import levelUpPopup from '@/components/mall/member/levelUpPopup.vue'
import signInPopup from '@/components/mall/member/signInPopup.vue'
import memberNode from '@/components/mall/nodes/memberNode.vue'
import petsNode from '@/components/mall/nodes/petsNode.vue'
import productColumn1 from '@/components/mall/nodes/productColumn1.vue'
import productColumn2 from '@/components/mall/nodes/productColumn2.vue'
import productColumn3 from '@/components/mall/nodes/productColumn3.vue'

export default {
    name: 'Index',
    components: {
        PetStoreHeader,
        promotion,
        recommend,
        singleImage,
        doubleImage,
        tribleImage,
        tribleImageTypeB,
        videoNode,
        swiperNode,
        brandIntroduction,
        HomeBlock,
        joinPopup,
        levelUpPopup,
        signInPopup,
        memberNode,
        petsNode,
        productColumn1,
        productColumn2,
        productColumn3
    },
    computed: {
        ...mapGetters(['token']),
        hotspotOffsetHeight() {
            const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
            return statusBarHeight + 32
        }
    },
    onPullDownRefresh() {
        this.init()
        uni.stopPullDownRefresh()
    },
    data() {
        return {
            construction: [],
            hotspots: [],
            whiteList: {
                All: true,
                58: true,
            },
            nodes: [],
            nodesTops: [],
            recommendNode: undefined,
            recommendNodeTop: 0,
            isInited: false,
            showNodesCount: 0,
            initOffset: 0
        }
    },
    mounted() {
        this.init()
    },
    onShow() {
        this.initNodes()
    },
    onPageScroll({ scrollTop }) {
        this.showNodes(scrollTop)
        this.$nextTick(() => {
            this.checkRecommend(scrollTop)
        })
    },
    methods: {
        async init() {
            this.isInited = false
            this.construction = []
            this.nodes = []
            this.hotspots = []
            await this.getHomePageConfig()
            await this.checkIsNewMember()
            this.$nextTick(async() => {
                this.$refs?.node?.forEach(node => {
                    if (node.init) {
                        node.init()
                    }
                    this.nodes.push(node)
                    const isRecommend = !!node?.setRecommendScrollStyle
                    if (isRecommend) {
                        this.recommendNode = node
                    }
                })
                await this.setNodesTop(true)
            })
            this.$refs.joinPopup.init()
            await this.$refs.signInPopup.init()
            this.$refs.levelUpPopup.init()
            this.isInited = true
        },
        setNodesTop(isInit) {
            return new Promise(resolve => {
                uni.createSelectorQuery().in(this).selectAll('.homeNode').boundingClientRect(data => {
                    this.nodesTops = data.map(i => i.top)
                    if (isInit) {
                        this.initOffset = this.nodesTops?.[0]
                    }
                    let offset = this.nodesTops[0] > 0 ? 0 : Math.abs(this.nodesTops[0])
                    if (!isInit) {
                        offset += this.initOffset
                    }
                    this.nodesTops = this.nodesTops.map(i => i + offset)
                    uni.createSelectorQuery().in(this).select('#home-recommend-node').boundingClientRect(data => {
                        this.recommendNodeTop = data.top + offset
                    }).exec()
                    this.$nextTick(() => {
                        this.showNodes(0)
                    })
                    resolve()
                }).exec()
            })
        },
        async initNodes() {
            if (!this.isInited) return
            this.nodes.forEach(i => {
                i.init ? i.init() : 0
            })
            this.$refs.joinPopup.init()
            await this.$refs.signInPopup.init()
            this.$refs.levelUpPopup.init()
        },
        showNodes(scrollTop) {
            this.nodesTops.forEach((i, inx) => {
                if (scrollTop >= i - 800) {
                    if (this.nodes[inx].show) {
                        return
                    }
                    this.nodes[inx].show = true
                    this.showNodesCount++
                    if (this.showNodesCount === this.nodes.length) {
                        this.setNodesTop()
                    }
                }
            })
        },
        checkRecommend(scrollTop) {
            if (!this.recommendNode) {
                return
            }
            const func = () => {
                scrollTop >= (this.recommendNodeTop - 50) ? this.recommendNode?.setRecommendScrollStyle(true) : this.recommendNode?.setRecommendScrollStyle(false)
            }
            if (this.recommendNodeTop) {
                func()
            } else {
                uni.createSelectorQuery().in(this).select('#home-recommend-node').boundingClientRect(data => {
                    this.recommendNodeTop = data.top
                }).exec()
                func()
            }
        },
        getHomePageConfig() {
            this.$message.loading()
            return viewModel.homepage().then(res => {
                if (res.status === 0) {
                    const { templates, blocks } = JSON.parse(res.data?.templateContent)
                    this.construction = templates || []
                    this.hotspots = blocks || []
                } else {
                    this.$toast({ title: res.message })
                }
            }).finally(() => {
                this.$message.hide()
            })
        },
        checkIsNewMember() {
            if (!this.token) {
                return
            }
            let userType = []
            this.construction.forEach(i => {
                if (!['ALL', 1].includes(i.userType)) {
                    userType.push(i.userType)
                }
            })
            userType = uniq(userType)
            this.$message.loading()
            const validates = []
            userType.forEach(i => {
                validates.push(ruleModel.validate({ ruleId: i }))
            })
            return Promise.all(validates).then(res => {
                res.forEach((i, index) => {
                    this.whiteList[userType[index]] = i.data
                })
                this.whiteList[1] = !this.whiteList[58] // 老用户为!roleId===58
            }).finally(() => {
                this.$message.hide()
            })
        },
        checkNodeAvaliable(node) {
            if (node.userType === 'ALL') {
                return true
            }
            return this.whiteList[node.userType]
        },
    }
}
</script>

<style scoped lang="scss">
.pa-home-page{
    background: #F5F5F5;
    &-header{
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        &-logo{
            width: 166rpx;
            height: 64rpx
        }
    }
    &-main{
        margin: 0 16rpx;
        &-item{
            margin-bottom: 16rpx;
        }
    }
}
</style>
