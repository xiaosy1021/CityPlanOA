<template>
  <div class="main-layout">
    <main>
      <nav>
        <header>
          <div class="detail">
            <span
              class="ivu-avatar ivu-avatar-circle ivu-avatar-large ivu-avatar-icon"
              style="background-color: rgb(135, 208, 104);"
            >
              <i class="ivu-icon ivu-icon-ios-person-outline"></i>
            </span>
            <p>欢迎登录，{{userName}}</p>
            <p>
              <span @click="handleExit">[ 注销 ]</span>
            </p>
          </div>
        </header>
        <main>
          <MenuLeft
            :activeMenu="$route.matched[$route.matched.length - 1].meta.menuKey"
            :openMenu="['1']"
          ></MenuLeft>
        </main>
      </nav>
      <main>
        <header>徐州经济技术开发区规划办文系统</header>
        <main>
          <header>
            <Breadcrumb class="bread-crumb">
              <BreadcrumbItem
                v-for="(item,idx) in $route.matched"
                :key="idx"
                :to="convertRouterPath(item.path)"
              >{{item.meta.name}}</BreadcrumbItem>
            </Breadcrumb>
          </header>
          <main>
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive" />
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive" />
          </main>
        </main>
      </main>
    </main>
    <footer>
      <p>技术支持：苏州工业园区测绘地理信息有限公司 版权所有© 2020</p>
    </footer>
  </div>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";
import { mapGetters, mapActions } from "vuex";
import MenuLeft from "@/views/main/MenuLeft";
export default {
  components: {
    MenuLeft
  },
  mixins: [routerparams],
  data() {
    return {
      path: "",
      userName: "管理员"
    };
  },
  computed: {
    ...mapGetters("oidcStore", ["oidcUser"])
  },
  mounted() {
    debugger;
    let user = sessionStorage.getItem("userInfo");
    if (user) {
      this.userName = JSON.parse(user).userName;
    }
  },
  methods: {
    ...mapActions("oidcStore", ["authenticateOidcSilent", "signOutOidc"]),
    onUserItemClick(name) {
      switch (name) {
        case "exit":
          this.exit();
          break;
      }
    },
    handleExit() {
      this.$Modal.confirm({
        title: "系统注销",
        content: "您确定注销系统吗？",
        onOk: () => {
          this.signOutOidc();
        }
      });
    },
    getPath() {
      this.path = this.$route.matched;
    }
  }, // 监听,当路由发生变化的时候执行
  watch: {
    $route: "getPath"
  }
};
</script>


<style lang="less" scoped>
.layout-view {
  height: 100%;
  overflow: hidden;
  width: 100%;
}

.titleHeader {
  width: 350px;
  font-size: 18px;
  float: left;
  margin-left: -25px;

  * {
    vertical-align: middle;
  }

  .logo {
    width: 40px;
    margin-right: 10px;
  }
}

.layout-nav {
  margin: 0 auto;
  margin-right: -60px;
}

.ivu-layout-content {
  flex: auto;
  padding: 24px;
  border: 1px solid #dcdee2;
}

.ivu-layout-header a {
  color: white;
  background: 0 0;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

a {
  color: black;
  background: 0 0;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.ivu-menu-horizontal {
  height: 0px;
  line-height: 60px;
  color: white;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
  height: inherit;
  line-height: inherit;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  color: white;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active {
  color: #2d8cf0;
  border-bottom: 2px solid #2d8cf0;
}

.user-tools {
  float: right;
  font-size: 12px;
  margin-right: -20px;
  color: white;
}

.user-info {
  cursor: pointer;

  * {
    vertical-align: middle;
  }

  &:hover {
    background: #515a6e;
  }

  .ivu-icon {
    margin-right: 5px;
  }
}

.ivu-dropdown-item-divided {
  margin-top: -5px;
  float: right;
  border-top: 1px solid #e8eaec;
}

.target {
  position: absolute;
  right: 105px;
}
</style>