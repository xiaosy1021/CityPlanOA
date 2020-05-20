'use strict'
let env = {
    oidcSettings: {
        authority: 'http://192.168.84.124:8610',
        client_id: 'xuzhouoa-js',
        client_secret: 'secret',
        response_type: 'code',
        scope: 'openid xuzhou-guihuaoa-webapi-fullaccess',
        loadUserInfo: true,
        revokeAccessTokenOnSignout: true,
        redirect_uri: window.document.location.origin + '/#/signincallback',
        silent_redirect_uri: window.document.location.origin + '/#/silentcallback',
        post_logout_redirect_uri: '',
        automaticSilentRenew: true,
        // userStore: new oidc.WebStorageStateStore({
        //   store: window.localStorage
        // })
    }
}

export default env