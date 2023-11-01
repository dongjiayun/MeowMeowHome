const whiteList = process.env.NODE_ENV ===
'development'
    ? ['ALL']
    // : ['videoShare', '404', 'mobileLogin', 'checkAuthCode', 'chooseType', 'completePrefile', 'showLocation', 'showTopic']
    : ['ALL']
// const whiteList = ['videoShare', '404']

export { whiteList }
