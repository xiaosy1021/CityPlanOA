
<template>
  <div>
    <Layout class="layout-view">
      <Header>
        <Menu mode="horizontal" theme="light" :active-name="$store.state.currentMainKey">
          <div class="layout-nav">
            <div class="titleHeader">
              <img class="logo" src="@/assets/img/logo/logo_sipsd.png">
              <span class="title">徐州经济技术开发区规划办文系统</span>
            </div>
            <div class="target">
              <MenuItem name="jcpz" :to="`/base/${IP}/${AppId}`">基础配置</MenuItem>
              <MenuItem name="sjpz" :to="`/data/${IP}/${AppId}`">数据配置</MenuItem>
              <MenuItem name="zypz" :to="`/resource/${IP}/${AppId}`">资源配置</MenuItem>
              <MenuItem name="gnpz" :to="`/function/${IP}/${AppId}`">功能配置</MenuItem>
              <MenuItem name="zysh" :to="`/examine/${IP}/${AppId}`">资源审核</MenuItem>
              <MenuItem name="wggl" :to="`/gataway/${IP}/${AppId}`">网关管理</MenuItem>
              <!-- <MenuItem name="yygl" :to="`/application/${IP}/${AppId}`">应用管理</MenuItem> -->
            </div>
          </div>
          <div class="user-tools">
            <Dropdown :transfer="false" placement="bottom-end" @on-click="onUserItemClick">
              <div class="user-info">
                <icon type="ios-contact" :size="20"/>
                <span>欢迎您，{{userName}}</span>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem name="exit" divided>
                  <icon type="ios-exit-outline" :size="16"/>
                  <span>退出系统</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Content :style="{padding: '0px',background: '#fff' ,height:'100%'}">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams],
  data() {
    return {
      path: "",
      userName: "管理员"
    };
  },
  mounted() {
    let user = sessionStorage.getItem("userInfo");
    if (user) {
      this.userName = JSON.parse(user).userName;
    }
  },
  methods: {
    onUserItemClick(name) {
      switch (name) {
        case "exit":
          this.exit();
          break;
      }
    },
    exit() {
      this.$Modal.confirm({
        title: "系统注销",
        content: "您确定注销系统吗？",
        onOk: () => {
          sessionStorage.clear();
          this.$router.push({
            path: "/login"
          });
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
  position: absolute;
  height: 100%;
  overflow-y: hidden;
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
