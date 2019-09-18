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
        <MenuGroup title="资源配置">
          <MenuItem
            name="9"
            :to="`/resource/layerManage/${IP}/${AppId}`"
          >
          <Icon type="logo-buffer" />图层管理</MenuItem>
          <MenuGroup title="基础配置">
            <MenuItem
              name="11-4"
              :to="`/resource/mapInfo/${IP}/${AppId}`"
            >
            <Icon type="md-map" />地图信息</MenuItem>
            <MenuItem
              name="11-5"
              :to="`/resource/menu/${IP}/${AppId}`"
            >
            <Icon type="md-menu" />菜单管理</MenuItem>
            <MenuItem
              name="11-6"
              :to="`/resource/moduleManager/${IP}/${AppId}`"
            >
            <Icon type="md-cube" />模块管理</MenuItem>
            <MenuItem
              name="11-7"
              :to="`/resource/toolsManage/${IP}/${AppId}`"
            >
            <Icon type="md-construct" />地图工具</MenuItem>
          </MenuGroup>
          <MenuGroup title="联系人配置">
            <template slot="title">
              <Icon type="ios-analytics"></Icon>联系人配置
            </template>
            <MenuItem
              name="11-0"
              :to="`/resource/ContactUser/${IP}/${AppId}`"
            >
            <Icon type="ios-contact" />联系人管理</MenuItem>
            <MenuItem
              name="11-1"
              :to="`/resource/ContactUserGroup/${IP}/${AppId}`"
            >
            <Icon type="ios-contacts" />分组配置</MenuItem>
            <MenuItem
              name="11-2"
              :to="`/resource/ContactgetFgroup/${IP}/${AppId}`"
            >
            <Icon type="md-people" />分组管理</MenuItem>
          </MenuGroup>
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