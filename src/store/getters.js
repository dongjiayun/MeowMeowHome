const getters = {
    // user
    token: state => state.user.token,
    refreshToken: state => state.user.refreshToken,
    avatarUrl: state => state.user.avatarUrl,
    username: state => state.user.username,
    platNo: state => state.user.platNo,
    cid: state => state.user.cid,
    phoneNo: state => state.user.phoneNo,
    // app
    showMask: state => state.app.showMask,
    showLoading: state => state.app.showLoading,
    statusBarHeight: state => state.app.statusBarHeight,
    popupMask: state => state.app.popupMask,
    disablePageScroll: state => state.app.disablePageScroll,
}

export default getters
