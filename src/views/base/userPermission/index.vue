<template>
  <div class="split-style">
    <Row :style="{ height: w_splitHeight }">
      <Col span="4" class="left-col">
      <div class="left-section">
        <Row>
          <Col span="16">
          <h3 class="left-title">角色权限管理</h3>
          </Col>
          <Col span="8">
          <Button icon="md-add" class="left-title-button" @click="onAdd"></Button>
          </Col>
        </Row>
        <RadioGroup vertical class="radio-group">
          <span v-for="item in roles" :key="item.id" @click="onChangeRole(item.id)">
            <Radio :label="item.name">{{item.name}}</Radio>
          </span>
        </RadioGroup>
      </div>
      </Col>
      <Col span="20" class="right-col">
      <div class="right-section">
        <Tabs value="name1">
          <TabPane label="用户管理" name="name1">
            <role-manage-menu :roleid="roleid" ref="rolemanage"></role-manage-menu>
          </TabPane>
          <TabPane label="菜单权限" name="name2">
            <permission-menu :roleid="roleid" ref="rolemenu"></permission-menu>
          </TabPane>
          <TabPane label="地图图层" name="name3">
            <map-layer :roleid="roleid" ref=rolemaplayer></map-layer>
          </TabPane>
          <TabPane label="地图对比" name="name4">
            <map-comparison :roleid="roleid" ref="rolemapcomparison"></map-comparison>
          </TabPane>
          <TabPane label="地图工具" name="name5">
            <map-tool :roleid="roleid" ref=rolemaptool></map-tool>
          </TabPane>
          <TabPane label="地图信息" name="name6">
            <map-info :roleid="roleid" ref="rolemapinfo"></map-info>
          </TabPane>
          <TabPane label="模块权限" name="name7">
            <component-permission :roleid="roleid" ref="rolecomponent"></component-permission>
          </TabPane>
          <TabPane label="Token" name="name8">
            <token :roleid="roleid" ref="roletoken"></token>
          </TabPane>
          <TabPane label="快速查询" name="name9">
            <quick-query :roleid="roleid" ref="rolequickquery"></quick-query>
          </TabPane>
        </Tabs>
      </div>
      </Col>
    </Row>
    <Modal v-model="showDialog" :mask-closable="false" width="500" title="新建角色">
      <role-form ref="modal"></role-form>
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog"></modal-footer>
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { computeh } from "@/core/computeh";
import ModalFooter from "@/components/modal-footer";
import RoleForm from "../roleManage/components/roleForm.vue";
import RoleManageMenu from "./components/roleManageMenu.vue";
import PermissionMenu from "./components/permissionMenu.vue";
import MapLayer from "./components/maplayer.vue";
import MapComparison from "./components/mapComparison.vue";
import MapTool from "./components/maptool.vue";
import MapInfo from "./components/mapinfo.vue";
import ComponentPermission from "./components/componentPermission.vue";
import Token from "./components/token.vue";
import QuickQuery from "./components/quickQuery.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      roles: [],
      rol: "",
      roleid: ""
    };
  },
  mounted() {
    this.renderRole();
  },
  methods: {
    //获取角色列表
    renderRole() {
      Server.get({
        url: services.getRoleQuery(this.AppId, this.IP)
      }).then(rsp => {
        if (rsp.status === 1) {
          this.roles = rsp.data.rows;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //新建角色
    onAdd() {
      this.$refs.modal.resetForm();
      this.showDialog = true;
    },
    //保存角色
    onSave() {
      var form = this.$refs.modal.getForm();
      if (form.name == "") {
        this.showDialog = true;
        this.$Message.warning("请填写角色名称");
      } else {
        Server.post({
          url: services.getRoleExecute(this.AppId, this.IP),
          params: {
            params: JSON.stringify(form)
          }
        }).then(rsp => {
          if (rsp.status === 1) {
            this.$Message.success("操作成功");
            this.showDialog = false;
            this.renderRole();
          } else {
            this.$Message.error(rsp.message);
          }
        });
      }
    },
    //取消角色新建
    onCancelDialog() {
      this.showDialog = false;
    },
    //获取角色列表的id
    onChangeRole(id) {
      this.roleid = id;
      this.$refs.rolemanage.renderUser(id); //tab=角色
      this.$refs.rolemenu.renderMenu(id); //tab=菜单
      this.$refs.rolemaplayer.renderMaplayer(id); //tab=地图图层（左）
      this.$refs.rolemaplayer.renderMapLayerright(id); //tab=地图图层(右)
      this.$refs.rolemapcomparison.renderMapleft(id); //tab=地图对比（左）
      this.$refs.rolemapcomparison.renderMapright(id); //tab=地图对比(右)
      this.$refs.rolemaptool.renderMaptool(id); //tab=地图工具
      this.$refs.rolemaptool.renderMaptoolright(id); //tab=地图工具（右）
      this.$refs.rolemapinfo.renderMapinfo(id); //tab=地图信息
      this.$refs.rolecomponent.renderComponent(id); //tab=组件权限
      this.$refs.roletoken.renderToken(id); //tab=token
      this.$refs.rolequickquery.renderQuickquery(id); //tab=快速查询
    }
  },
  components: {
    ModalFooter,
    //新建角色modal组件
    RoleForm,
    //角色管理权限
    RoleManageMenu,
    //菜单权限组件
    PermissionMenu,
    //地图图层组件
    MapLayer,
    //地图对比组件
    MapComparison,
    //地图工具组件
    MapTool,
    //地图信息组件
    MapInfo,
    //组件权限组件
    ComponentPermission,
    //token组件
    Token,
    //快速查询组件
    QuickQuery
  }
};
</script>