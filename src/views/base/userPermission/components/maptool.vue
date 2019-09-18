<template>
  <Row>
    <Col span="5" offset="0" class="check-menu" :class="{heightSet:isHeightSet}">
      <Tree ref="tree" :data="treedata" show-checkbox  :render="renderContent"></Tree>
       <span class="PC">PC端</span>
    </Col>
    <Col span="3">
      <div class="btn-group">
        <i-button type="default" @click="onExpandAll" >展开全部</i-button>
        <i-button type="default" @click="onCollpseAll">收起全部</i-button> 
        <i-button type="default" @click="onCheckAll">全选</i-button>
        <i-button type="default" @click="onUnCheckAll">全不选</i-button>
        <i-button type="default" @click="onSaveMaptool" :disabled="!roleid">保存</i-button>
      </div> 
    </Col>
    <Col span="5" offset="0" class="check-menu" :class="{heightSetRight:isHeightSetRight}">
      <Tree ref="treeright" :data="treeDataright" show-checkbox ></Tree>
      <span class="PC">移动端</span>
   </Col>
    <Col span="3">
      <div class="btn-group">
        <i-button type="default" @click="onExpandAllRight">展开全部</i-button>
        <i-button type="default" @click="onCollpseAllRight">收起全部</i-button> 
        <i-button type="default" @click="onCheckAllRight">全选</i-button>
        <i-button type="default" @click="onUnCheckAllRight">全不选</i-button>
        <i-button type="default" @click="onSaveMapright" :disabled="!roleid">保存</i-button>
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
      treedata: [],
      treeDataright: [],
      isHeightSet: false,
      isHeightSetRight: false
    };
  },
  mounted() {
    this.renderMaptool();
    this.renderMaptoolright();
  },
  methods: {
    //获取菜单列表
    renderMaptool(id) {
      if (id) {
        Server.get({
          url: services.getRoleFunQuery(this.AppId, this.IP)  + id + "&functiontype=maptool"
        }).then(rsp => {
          if (rsp.status === 1) {
            var changes = {
              expand: false
            };
            this.treeStore = new TreeStore(rsp.data.rcds, changes);
            this.treedata = this.treeStore.treeData;
          } else {
            this.$Message.error(rsp.message);
          }
        });
      }
    },
    renderMaptoolright(id) {
      if (id) {
        Server.get({
          url: services.getRoleFunQuery(this.AppId, this.IP)  + id + "&functiontype=maptool"
        }).then(rsp => {
          if (rsp.status === 1) {
            var changes = {
              expand: false
            };
            this.treeStoreRight = new TreeStore(rsp.data.rcd_mt, changes);
            this.treeDataright = this.treeStoreRight.treeData;
          } else {
            this.$Message.error(rsp.message);
          }
        });
      }
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
    renderContent(h, { root, node, data }) {
      return h("span", data.label);
    },
    onSaveMaptool() {
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
            functionType: "maptool",
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
    onSaveMapright() {
      var functionIds2 = [];
      var _data2 = this.treeStoreRight.getCheckedNodes(
        this.$refs.treeright.flatState
      );
      for (var i in _data2) {
        //遍历出json值的集合
        functionIds2.push(_data2[i].node.funId); //字符串组成数组
      }
      Server.post({
        url: services.getRoleFunSet(this.AppId, this.IP),
        params: {
          params: JSON.stringify({
            roleId: this.roleid,
            functionType: "maptool_mt",
            functionIds: functionIds2
          })
        }
      }).then(rsp => {
        if (status === 1) {
        } else {
          this.$Message.success("设置成功");
        }
      });
    },
    onExpandAllRight() {
      this.treeStoreRight.expandAll();
      this.isHeightSetRight = true;
    },
    //收起全部
    onCollpseAllRight() {
      this.treeStoreRight.collpseAll();
      this.isHeightSetRight = false;
    },
    //全选
    onCheckAllRight() {
      this.treeStoreRight.checkedAll();
    },
    //全部不选
    onUnCheckAllRight() {
      this.treeStoreRight.unCheckedAll();
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
.PC {
  position: absolute;
  bottom: 1px;
  right: 5px;
}
</style>
