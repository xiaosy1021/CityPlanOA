<template>
  <Row>
    <Col span="5" offset="0" class="check-menu">
      <Tree  ref="tree" :data="treedata" show-checkbox  :render="renderContent"></Tree>
    </Col>
    <Col span="3">
      <div class="btn-group">
        <i-button type="default" @click="onCheckAll">全选</i-button>
        <i-button type="default" @click="onUnCheckAll">全不选</i-button>
        <i-button type="default" class="" @click="onSaveMapinfo" :disabled="!roleid">保存</i-button>
      </div> 
    </Col>
  </Row>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import TreeStore from "../store/tree-store";
import { routerparams } from "@/core/mixins/routerp";
export default {
  mixins: [routerparams],
  props: {
    roleid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      treedata: []
    };
  },
  mounted() {
    this.renderMapinfo();
  },
  methods: {
    //获取菜单列表
    renderMapinfo(id) {
      Server.get({
        url: services.getRoleFunQuery(this.AppId, this.IP)  + id + "&functiontype=mapinfo"
      }).then(rsp => {
        if (rsp.status === 1) {
          var changes = {
            expand: true
          };
          this.treeStore = new TreeStore(rsp.data.rcds, changes);
          this.treedata = this.treeStore.treeData;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //全选
    onCheckAll() {
      this.treeStore.checkedAll();
    },
    //全部不选
    onUnCheckAll() {
      this.treeStore.unCheckedAll();
    },
    renderContent(h, { root, node, data }) {
      return h("span", data.label);
    },
    onSaveMapinfo() {
      var functionIds = [];
      var _data1 = this.treeStore.getCheckedNodes(this.$refs.tree.flatState);
      for (var i in _data1) {
        //遍历出json值的集合
        functionIds.push(_data1[i].node.funId); //字符串组成数组
      }
      Server.post({
        url: services.getRoleFunSet(this.AppId, this.IP),
        params: {
          params: JSON.stringify({
            roleId: this.roleid,
            functionType: "mapinfo",
            functionIds: functionIds
          })
        }
      }).then(rsp => {
        if (status === 1) {
        } else {
          this.$Message.success("设置成功");
        }
      });
    }
  },
  components: {}
};
</script>
<style scoped>
.check-menu {
  border: 1px dotted #ddd;
  height: 400px;
  min-width: 240px;
  padding: 5px 10px 50px 10px;
  overflow-y: scroll;
}
.btn-group {
  margin: 60px 10px;
}
.btn-group button {
  display: block;
  margin: 5px 0;
  width: 80px;
}
</style>
