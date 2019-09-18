<template>
  <Layout>
    <Sider
      class="sub-menu-container"
      hide-trigger
    >
      <Menu
        class="sub-menu"
        theme="light"
        width="auto"
        :active-name="$store.state.currentSubKey"
      >
        <MenuGroup title="功能配置">
          <MenuItem
            name="1"
            :to="`/function/serviceManage/${IP}/${AppId}`"
          >
          <Icon type="md-cloud" />服务管理</MenuItem>
          <MenuItem
            name="2"
            :to="`/function/search/${IP}/${AppId}`"
          >
          <Icon type="md-search" />查询模块</MenuItem>
          <MenuItem
            name="3"
            :to="`/function/BusinessStats/${IP}/${AppId}`"
          >
          <Icon type="md-analytics" />统计模块</MenuItem>
          <MenuItem
            name="4"
            :to="`/function/quickQuery/${IP}/${AppId}`"
          >
          <Icon type="md-flash" />快查模块</MenuItem>
        </MenuGroup>
      </Menu>
    </Sider>
    <Layout class="main-layout">
      <Breadcrumb class="bread-crumb">
        <BreadcrumbItem
          v-for="(item,idx) in $route.matched"
          :key="idx"
          :to="convertRouterPath(item.path)"
        >{{item.meta.name}}</BreadcrumbItem>
      </Breadcrumb>
      <Content>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
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