import 'core-js/fn/promise'
import {
    vuexOidcProcessSilentSignInCallback
} from 'vuex-oidc'
import env from '../global'

vuexOidcProcessSilentSignInCallback(env.oidcSettings)