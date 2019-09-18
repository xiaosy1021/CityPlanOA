<template>
  <div class="split-style">
    <Row :style="{ height: w_splitHeight }">
      <Col
        span="4"
        class="left-col"
      >
      <div class="left-section">
        <Tree
          ref="tree"
          :data="treeData"
          :render="renderContent"
        ></Tree>
      </div>
      </Col>
      <Col
        span="20"
        class="right-col"
      >
      <div class="right-section">
        <div class="right-search-header">
          <search-buttons
            :showSearch="false"
            @on-refresh="onRefresh"
            @on-add="onAdd"
          ></search-buttons>
        </div>
        <Table
          :loading="isLoading"
          border
          :height="w_splitTableHeight"
          :columns="table.columns"
          :data="table.data"
          :row-class-name="rowClass"
          :disabled-hover="dragStart"
          @on-sort-change="onSort"
          @on-row-dblclick="onEdit"
        ></Table>
      </div>
      </Col>
      <Modal
        v-model="showDialog"
        :mask-closable="false"
        width="800"
        title="图层管理"
      >
        <layer-form
          ref="layerForm"
          :parent-id="currentNodeId"
          @on-close="showDialog = false"
        />
        <modal-footer
          slot="footer"
          @on-save="onSave"
          @on-cancel="onCancelDialog"
        />
      </Modal>
    </Row>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { computeh } from "@/core/computeh";
import { renderHelper } from "@/core/common";
import LayerForm from "./components/layerForm.vue";
import ModalFooter from "@/components/modal-footer";
import SearchButtons from "@/components/search-buttons";
import DragSupport from "@/core/mixins/dragSupport";
import "@/assets/css/drag.less";

export default {
  mixins: [computeh, routerparams, DragSupport],
  data() {
    return {
      showDialog: false,
      sortType: "",
      dragStart: false,
      isLoading: false,
      currentNodeId: "",
      treeData: [
        {
          title: "图层管理",
          id: "0",
          expand: true,
          children: []
        }
      ],
      table: {
        columns: [
          {
            type: "index",
            width: 50,
            align: "center"
          },
          {
            title: "名称",
            key: "name",
            sortable: true,
            align: "center"
          },
          {
            title: "标签",
            key: "label",
            align: "center"
          },
          {
            title: "图层类型",
            key: "layerType",
            align: "center"
          },
          {
            title: "服务地址",
            key: "serviceUrl",
            minWidth: 80,
            align: "center"
          },
          {
            title: "图层列表",
            key: "VisibleLayers",
            align: "center"
          },
          {
            title: "Token名",
            key: "tokenName",
            align: "center"
          },
          {
            title: "透明度",
            key: "opacity",
            maxWidth: 80,
            align: "center"
          },
          {
            title: "顺序",
            key: "order",
            maxWidth: 70,
            align: "center"
          },
          {
            title: "操作",
            key: "action",
            maxWidth: 120,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderDefaultOpterForTable(
                h,
                params,
                this.onEdit,
                this.onDelete
              );
            }
          }
        ],
        data: []
      }
    };
  },
  //使用了keep-alive后，每次切换路由会触发activated的钩子
  activated() {
    if (this.$route.meta.noTrigger === true) {
      //noTrigger为true，表示是从其他页面转到当前页的，此时无需重新加载数据，并将noTrigger的值重置为false
      //TODO 如果不是通过浏览器后退，直接通过菜单切换访问当前页，noTrigger的值并没有重置
      this.$route.meta.noTrigger = false;
    } else {
      //由于keep-alive后，不论何种路由切换，当前页面都会保持原状态，但是只希望在后退时，保持原状态，普通的菜单切换，仍然重新加载
      this.currentNodeId = "";
      this.loadTree();
    }
  },
  mounted() {
    this.loadTree();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return renderHelper.renderDefaultNodeForTree(
        h,
        { root: root, node: node, data: data },
        this.treeNodeClick,
        this.$refs.tree,
        "ios-paper-outline",
        {
          dragover: this.layerDragover,
          drop: this.layerDrop,
          dragend: this.layerDragend,
          save: this.onSaveDrag
        }
      );
    },
    //获取菜单列表
    loadTree(expandSelf = false) {
      this.$Spin.show();
      Server.get({
        url: services.getMapLayerGetAllTree(this.AppId, this.IP)
      }).then(rsp => {
        this.$Spin.hide();
        if (rsp.status === 1) {
          let result = renderHelper.findNodeChildren(
            { children: rsp.data },
            this.currentNodeId,
            {
              expandSelf: expandSelf
            }
          );
          if (result === true) {
            this.treeData[0].isSelected = false;
          } else {
            this.treeData[0].isSelected = true;
            this.currentNodeId = "0";
          }
          this.treeData[0].children = rsp.data;
          this.onSearch();
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //详情查询
    treeNodeClick(node) {
      let id = node.id;
      this.currentNodeId = id;
      this.loadTable(id);
    },
    onSearch() {
      if (!this.currentNodeId) {
        this.$Message.warning("请选择一个节点");
        return;
      }
      this.loadTable(this.currentNodeId);
    },
    loadTable(layerId) {
      this.isLoading = true;
      Server.get({
        url: services.getMapLayerGetSubMapLayers(this.AppId, this.IP),
        params: {
          layerId: layerId,
          appid: this.AppId
        }
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.status === 1) {
          this.table.data = rsp.data;
          this.$nextTick(() => {
            this.bindTableDrag(rsp.data, this.onSaveDrag);
          });
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    onAdd() {
      if (!this.currentNodeId) {
        this.$Message.warning("请选择一个节点");
        return;
      }
      this.showDialog = true;
      this.$refs.layerForm.resetForm();
    },
    //删除
    onDelete(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要删除的行");
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "是否永久删除此数据?",
          onOk: () => {
            Server.get({
              url:
                services.getMapLayerDelete(this.AppId, this.IP) + currentRow.id
            }).then(rsp => {
              if (rsp.status == 1) {
                this.$Message.success("删除成功");
                this.onRefresh();
              } else {
                this.$Message.error(rsp.message);
              }
            });
          },
          onCancel: () => {}
        });
      }
    },
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.layerForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    onRefresh() {
      this.loadTree();
    },
    //保存
    onSave() {
      let form = this.$refs.layerForm.getForm();
      if (form == null) {
        return;
      }
      Server.post({
        url: services.getMapLayerExecute(this.AppId, this.IP),
        params: {
          params: JSON.stringify(form)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("操作成功");
          this.showDialog = false;
          this.onRefresh();
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //取消
    onCancelDialog() {
      this.showDialog = false;
    },
    //保存拖放
    onSaveDrag(src, target, position) {
      let params = this.defaultDragResultCalc(src, target, position);
      if (params) {
        Server.post({
          url: services.getMapLayerDrag(this.AppId, this.IP),
          params: {
            params: JSON.stringify(params)
          }
        }).then(resp => {
          if (resp.status === 1) {
            this.loadTree(true);
          } else {
            this.$Message.error(resp.message);
          }
        });
      }
    },
    onSort(args) {
      this.sortType = args.order;
      if (args.order == "normal") {
        //发生排序重置后，表格会被重新渲染，应重新绑定属性和事件
        this.$nextTick(function() {
          this.bindTableDrag(this.table.data, this.onSaveDrag);
        });
      }
    }
  },
  components: {
    LayerForm,
    SearchButtons,
    ModalFooter
  }
};
</script>
