export default {
    data() {
        return {
            bgType: 'transparent',
        }
    },
    onPageScroll(e) {
        if (parseInt(e.scrollTop) >= 44) this.bgType = 'white'
        else this.bgType = 'transparent'
    },
}
