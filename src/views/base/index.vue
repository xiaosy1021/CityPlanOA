<template>
  <Layout>
    <Sider class="sub-menu-container" hide-trigger>
      <!-- <MenuLeft :activeMenu="'8-1'" :openMenu="'8'"></MenuLeft> -->
      <!-- <MenuLeft :activeMenu="this.MenuName" :openMenu="['8']"></MenuLeft> -->
      <MenuLeft :activeMenu="$route.matched[$route.matched.length - 1].meta.menuKey" :openMenu="['8']"></MenuLeft>
    </Sider>
    <Layout class="main-layout">
      <Breadcrumb class="bread-crumb">
        <BreadcrumbItem v-for="(item,idx) in $route.matched" :key="idx" :to="convertRouterPath(item.path)">
          {{item.meta.name}}</BreadcrumbItem>
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
  import MenuLeft from "@/views/main/MenuLeft";
  import {
    routerparams
  } from "@/core/mixins/routerp";

  export default {
    mixins: [routerparams],
    components: {
      MenuLeft
    }
  };
</script>