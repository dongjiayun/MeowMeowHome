export default {
    data() {
        return {
            pageSize: 20,
            pageNo: 1,
            totalNum: 0,
            loading: false,
            noMore: false
        }
    },
    methods: {
        initPagination() {
            this.pageNo = 1
            this.totalNum = 0
            this.noMore = false
            this.loading = false
        }
    },
    onPullDownRefresh() {
        this.pageNo = 1
    },
}
