<template>
  <Layout>
    <Sider class="sub-menu-container" hide-trigger>
      <Menu class="sub-menu" theme="light" width="auto" :active-name="$store.state.currentSubKey">
        <MenuGroup title="基础配置">
          <MenuItem name="1" :to="`/base/AppManage/${IP}/${AppId}`">
          <Icon type="ios-appstore" />App管理</MenuItem>
          <MenuItem name="2" :to="`/base/urlManage/${IP}/${AppId}`">
          <Icon type="md-link" />URL管理</MenuItem>
          <MenuItem name="3" :to="`/base/tokenManage/${IP}/${AppId}`">
          <Icon type="md-key" />Token管理</MenuItem>
          <MenuItem name="4" :to="`/base/userManage/${IP}/${AppId}`">
          <Icon type="md-person" />用户管理</MenuItem>
          <MenuItem name="5" :to="`/base/roleManage/${IP}/${AppId}`">
          <Icon type="md-people" />角色管理</MenuItem>
          <MenuItem name="6" :to="`/base/userPermission/${IP}/${AppId}`">
          <Icon type="md-lock" />角色权限</MenuItem>
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