<template>
    <pa-popup ref="popup" class="pa-uni-search-popup">
        <pa-uni-search ref="form" :forms="forms" />
    </pa-popup>
</template>

<script>
export default {
    name: 'PaUniSearchPopup',
    props: {
        forms: Array
    },
    data() {
        return {
            form: {}
        }
    },
    methods: {
        open(form) {
            this.$refs.form.init(form)
            this.$refs.popup.open()
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-uni-search-popup{
}
</style>
