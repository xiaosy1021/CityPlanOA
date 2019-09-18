<template>
  <Row>
    <i-col span="5" offset="0" class="check-menu" :class="{heightSet:isHeightSet}">
       <Tree ref="tree" :data="treedata" show-checkbox @on-select-change="selectionClick"></Tree>
    </i-col>
    <i-col span="3">
      <div class="btn-group">
        <i-button type="default" @click="onExpandAll" >展开全部</i-button>
        <i-button type="default" @click="onCollpseAll">收起全部</i-button> 
        <i-button type="default" @click="onCheckAll">全选</i-button>
        <i-button type="default" @click="onUnCheckAll">全不选</i-button>
        <i-button type="default" @click="onSaveMenu" :disabled="!roleid">保存</i-button>
      </div> 
    </i-col>
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
      treedata: [],
      isHeightSet: false
    };
  },
  mounted() {
    this.renderMenu();
  },
  methods: {
    //获取菜单列表
    renderMenu(id) {
      Server.get({
        url: services.getRoleFunQuery(this.AppId, this.IP)  + id + "&functiontype=menu"
      }).then(rsp => {
        if (rsp.status === 1) {
          var changes = {
            expand: false
          };
          this.treeStore = new TreeStore(rsp.data.rcds, changes);
          this.treedata = this.treeStore.treeData;
        } else {
          Message.error(rsp.message);
        }
      });
    },
    //展开全部
    onExpandAll() {
      this.treeStore.expandAll();
      this.isHeightSet = true;
    },
    //收起全部
    onCollpseAll() {
      this.treeStore.collpseAll();
      this.isHeightSet = false;
    },
    //全选
    onCheckAll() {
      this.treeStore.checkedAll();
    },
    //全部不选
    onUnCheckAll() {
      this.treeStore.unCheckedAll();
    },
    //保存节点菜单
    onSaveMenu() {
      var functionIds = [];
      var _data = this.treeStore.getCheckedNodes(this.$refs.tree.flatState);
      for (var i in _data) {
        //遍历出json值的集合
        functionIds.push(_data[i].node.funId); //字符串组成数组
      }
      Server.post({
        url: services.getRoleFunSet(this.AppId, this.IP),
        params: {
          params: JSON.stringify({
            roleId: this.roleid,
            functionType: "menu",
            functionIds: functionIds
          })
        }
      }).then(rsp => {
        if (status === 1) {
        } else {
          this.$Message.success("设置成功");
        }
      });
    },
    //返回当前选中的数组
    selectionClick(arry) {}
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
.heightSet {
  height: 100%;
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
