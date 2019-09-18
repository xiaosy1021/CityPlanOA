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
        <MenuGroup title="数据配置">
          <MenuGroup title="查询模板">
            <MenuItem
              name="1"
              :to="`/data/iSearch/${IP}/${AppId}`"
            >
            <Icon type="md-list" />List模板</MenuItem>
            <MenuItem
              name="2"
              :to="`/data/Grid/${IP}/${AppId}`"
            >
            <Icon type="md-grid" />Grid模板</MenuItem>
          </MenuGroup>
          <MenuGroup title="消息模板">
            <MenuItem
              name="8-1"
              :to="`/data/EmailMsgTmpl/${IP}/${AppId}`"
            >
            <Icon type="md-mail" />邮件管理</MenuItem>
            <MenuItem
              name="8-2"
              :to="`/data/shortMsgTmpl/${IP}/${AppId}`"
            >
            <Icon type="ios-chatboxes" />短信管理</MenuItem>
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