<template>

  <Menu class="sub-menu" theme="dark" width="auto" :active-name="activeMenu" :open-names="openMenu" accordion>
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-paper" />
        办文管理
      </template>
      <MenuItem name="1-1" :to="`/data/EmailMsgTmpl`">项目集</MenuItem>
      <MenuItem name="1-2" :to="`/data/Project`">项目信息</MenuItem>
      <MenuItem name="1-3" :to="`/data/Grid`">申请信息</MenuItem>
      <MenuItem name="1-4" :to="`/data/Company`">单位信息</MenuItem>
      <MenuItem name="1-5" :to="`/data/iSearch`">文档信息</MenuItem>
      <MenuItem name="1-6">书证信息</MenuItem>
    </Submenu>
    <Submenu name="8">
      <template slot="title">
        <Icon type="md-settings" />
        系统管理
      </template>
      <MenuItem name="8-1" :to="`/base/userManage`">用户信息</MenuItem>
      <MenuItem name="8-2" :to="`/base/roleManage`">角色信息</MenuItem>
      <MenuItem name="8-3" :to="`/base/userPermission`">权限控制</MenuItem>
    </Submenu>
  </Menu>

</template>

<script>
  export default {
    components: {},
    props: {
      activeMenu: {
        type: String,
        default: "1-1"
      },
      openMenu: null
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  }
</script>
<style lang="less" scoped>
</style>