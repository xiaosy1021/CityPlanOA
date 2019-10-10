<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="less">
</style>

<script>
import { mapGetters } from 'vuex'
import Server from "@/core/server"

export default {
  name: 'App',
  computed: {
    ...mapGetters('oidcStore', [
      'oidcIsAuthenticated',
      'oidcAccessToken',
    ]),
    hasAccess: function () {
      return this.oidcIsAuthenticated || this.$route.meta.isPublic
    }
  },
  methods: {
    userLoaded: function (e) {
      // console.log('I am listening to the user loaded event in vuex-oidc', e.detail)
    }
  },
  mounted () {
    Server.setToken(() => this.oidcAccessToken);
    window.addEventListener('vuexoidc:userLoaded', this.userLoaded)
  },
  destroyed () {
    window.removeEventListener('vuexoidc:userLoaded', this.userLoaded)
  }
}
</script>
