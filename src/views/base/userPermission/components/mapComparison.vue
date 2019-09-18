<template>
  <Row>
    <Col span="5" offset="0" class="check-menu" :class="{heightSetLeft:isHeightSetLeft}">
      <Tree ref="treeleft" :data="treeDataleft" show-checkbox></Tree>
       <span class="PC">左图层</span>
    </Col>
    <Col span="3">
      <div class="btn-group">
         <i-button type="default" @click="onExpandAllLeft">展开全部</i-button>
        <i-button type="default" @click="onCollpseAllLeft">收起全部</i-button> 
        <i-button type="default" @click="onCheckAllLeft">全选</i-button>
        <i-button type="default" @click="onUnCheckAllLeft">全不选</i-button>
        <i-button type="default" @click="onSaveMapleft" :disabled="!roleid">保存</i-button>
      </div> 
    </Col>
    <Col span="5" offset="0" class="check-menu" :class="{heightSetRight:isHeightSetRight}">
      <Tree ref="treeright" :data="treeDataright" show-checkbox ></Tree>
     <span class="PC">右图层</span>
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
import { routerparams } from "@/core/mixins/routerp";
import { services } from "@/core/services";
import TreeStore from "../store/tree-store";
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
      treeDataleft: [],
      treeDataright: [],
      isHeightSetLeft: false,
      isHeightSetRight: false
    };
  },
  mounted() {
    this.renderMapleft();
    this.renderMapright();
  },
  methods: {
    //获取左侧地图列表
    renderMapleft(id) {
      Server.get({
        url:
          services.getRoleFunQuery(this.AppId, this.IP) +
          id +
          "&functiontype=leftlayer"
      }).then(rsp => {
        if (rsp.status === 1) {
          var changes = {
            expand: false
          };
          this.treeStoreLeft = new TreeStore(rsp.data.rcds, changes);
          this.treeDataleft = this.treeStoreLeft.treeData;
        } else {
          Message.error(rsp.message);
        }
      });
    },
    //展开全部
    onExpandAllLeft() {
      this.treeStoreLeft.expandAll();
      this.isHeightSetLeft = true;
    },
    //收起全部
    onCollpseAllLeft() {
      this.treeStoreLeft.collpseAll();
      this.isHeightSetLeft = false;
    },
    //全选
    onCheckAllLeft() {
      this.treeStoreLeft.checkedAll();
    },
    //全部不选
    onUnCheckAllLeft() {
      this.treeStoreLeft.unCheckedAll();
    },
    //-------------------------左右分割线----------------------
    //获取右侧地图列表
    renderMapright(id) {
      Server.get({
        url:
          services.getRoleFunQuery(this.AppId, this.IP) +
          id +
          "&functiontype=rightlayer"
      }).then(rsp => {
        if (rsp.status === 1) {
          var changes = {
            expand: false
          };
          this.treeStoreRight = new TreeStore(rsp.data.rcds, changes);
          this.treeDataright = this.treeStoreRight.treeData;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //展开全部
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
    },
    //z左保存
    onSaveMapleft() {
      var functionIds1 = [];
      var _data1 = this.treeStoreLeft.getCheckedNodes(
        this.$refs.treeleft.flatState
      );
      for (var i in _data1) {
        //遍历出json值的集合
        functionIds1.push(_data1[i].node.funId); //字符串组成数组
      }
      Server.post({
        url: services.getRoleFunSet(this.AppId, this.IP),
        params: {
          params: JSON.stringify({
            roleId: this.roleid,
            functionType: "leftlayer",
            functionIds: functionIds1
          })
        }
      }).then(rsp => {
        if (status === 1) {
        } else {
          //Message.error(rsp.message);
          this.$Message.success("设置成功");
        }
      });
    },
    //右保存
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
            functionType: "rightlayer",
            functionIds: functionIds2
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
  height: 100%;
  min-width: 240px;
  padding: 5px 10px 50px 10px;
  overflow-y: scroll;
}
.heightSetLeft {
  height: 100%;
}
.heightSetRight {
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
