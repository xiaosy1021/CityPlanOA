<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="less">
</style>

<script>
import "@/core/utils/prototype";
import { mapGetters } from "vuex";
import Server from "@/core/server";
import { services } from "@/core/services";
import { CONSTCFG } from "@/core/const";

export default {
  name: "App",
  computed: {
    ...mapGetters("oidcStore", [
      "oidcUser",
      "oidcIsAuthenticated",
      "oidcAccessToken"
    ]),
    hasAccess: function() {
      return this.oidcIsAuthenticated || this.$route.meta.isPublic;
    }
  },
  data() {
    return {
      //字典表
      dataDictionary: []
    };
  },
  watch: {
    oidcAccessToken: function(val) {
      if (val) {
        Server.setToken(this.oidcAccessToken);
        window.addEventListener("vuexoidc:userLoaded", this.userLoaded);
        this.getDictionary();
      }
    }
  },
  mounted() {},

  methods: {
    userLoaded: function(e) {
      // console.log('I am listening to the user loaded event in vuex-oidc', e.detail)
    },

    async getDictionary() {
      let rsp = await Server.get({
        url: services.dictionary.all,
        params: {
          code: "0",
          recursive: "true"
        }
      });
      if (rsp.success === true) {
        CONSTCFG.DataProjType = [];
        CONSTCFG.DataLandusage = [];
        CONSTCFG.DataDictionary = rsp.result;
        this.dataDictionary = rsp.result;
        this.dataDictionary.forEach(p => {
          this.getProjTypeTree(p);
          this.getLandusageTree(p);
          this.getDocTypeTree(p);
          this.getCertTypeTree(p);
          this.getApplicationTypeTree(p);
        });
      } else {
        this.$Message.error("获取字典信息失败！");
      }
    },

    getProjTypeTree(v) {
      if (v.parentCode == "1001000") {
        var item = {
          value: v.code,
          label: v.displayText,
          children: []
        };

        this.getChildren(item);

        CONSTCFG.DataProjType.push(item);
      }
    },

    getLandusageTree(v) {
      if (v.parentCode == "322013000") {
        var item = {
          value: v.code,
          label: v.displayText,
          children: []
        };

        this.getChildren(item);

        CONSTCFG.DataLandusage.push(item);
      }
    },

    getDocTypeTree(v) {
      if (v.parentCode == "4010000-0") {
        var item = {
          value: v.code,
          label: v.displayText,
          children: []
        };

        this.getChildren(item);

        CONSTCFG.DataDocType.push(item);
      }
    },

    getCertTypeTree(v) {
      if (v.parentCode == "1110000-0") {
        var item = {
          value: v.code,
          label: v.displayText,
          children: []
        };

        this.getChildren(item);

        CONSTCFG.DataCertType.push(item);
      }
    },

    getApplicationTypeTree(v) {
      if (v.parentCode == "322019000") {
        var item = {
          value: v.code,
          label: v.displayText,
          children: []
        };

        this.getChildren(item);

        CONSTCFG.DataApplicationType.push(item);
      }
    },

    getChildren(item) {
      this.dataDictionary.forEach(v => {
        if (v.parentCode == item.value) {
          var child = {
            value: v.code,
            label: v.displayText,
            children: []
          };

          this.getChildren(child);

          item.children.push(child);
        }
      });
    }
  },

  destroyed() {
    window.removeEventListener("vuexoidc:userLoaded", this.userLoaded);
  }
};
</script>