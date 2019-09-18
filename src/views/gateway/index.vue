
<template>
  <Layout>
    <Sider class="sub-menu-container" hide-trigger>
      <Menu class="sub-menu" theme="light" width="auto" :active-name="$store.state.currentSubKey">
        <MenuGroup title="功能配置">
          <MenuItem name="1" :to="`/gataway/gateWayManage/${IP}/${AppId}`">
          <Icon type="md-globe" />网关管理</MenuItem>
        </MenuGroup>
      </Menu>
    </Sider>
    <Layout class="main-layout">
      <Breadcrumb class="bread-crumb">
        <BreadcrumbItem v-for="(item,idx) in $route.matched" :key="idx" :to="convertRouterPath(item.path)">{{item.meta.name}}</BreadcrumbItem>
      </Breadcrumb>
      <Content>
        <router-view />
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams]
};
</script>