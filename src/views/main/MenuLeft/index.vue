<template>
  <Menu class="sub-menu" width="auto" :active-name="activeMenu" :open-names="openMenu" accordion>
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-paper" />
        办文管理
      </template>
      <MenuItem name="1-1" :to="`/data/ProjectSet`">项目集</MenuItem>
      <MenuItem name="1-2" :to="`/data/Project`">项目信息</MenuItem>
      <MenuItem name="1-3" :to="`/data/Application`">申请信息</MenuItem>
      <MenuItem name="1-4" :to="`/data/Company`">单位信息</MenuItem>
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