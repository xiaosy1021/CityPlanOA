<template>
  <Layout>
    <Sider class="sub-menu-container" hide-trigger>
      <Menu class="sub-menu" theme="light" width="auto" :active-name="$store.state.currentSubKey">
        <MenuGroup title="基础配置">
          <MenuItem name="16" :to="`/examine/waitCheck/${IP}/${AppId}`">
          <Icon type="md-code-working" />待审核项</MenuItem>
          <MenuItem name="17" :to="`/examine/checked/${IP}/${AppId}`">
          <Icon type="md-checkbox-outline" />已审核项</MenuItem>
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