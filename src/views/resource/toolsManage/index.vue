<template>
  <div class="split-style">
    <Row :style="{ height: w_splitHeight }">
      <Col span="4" class="left-col">
      <div class="left-section">
        <Tree ref="tree" :data="treeData" :render="renderTreeNode"></Tree>
      </div>
      </Col>
      <Col span="20" class="right-col">
      <div class="right-section">
        <div class="right-search-header">
          <search-buttons :showSearch="false" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
        </div>
        <Table border :height="w_splitTableHeight" :columns="table.columns" :data="table.data"></Table>
      </div>
      </Col>
      <Modal v-model="showDialog" :mask-closable="false" width="500" title="地图工具">
        <tool-form ref="toolForm" :datas="datas" :parent-id="currentNodeId"/>
        <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog"></modal-footer>
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
import ModalFooter from "@/components/modal-footer";
import SearchButtons from "@/components/search-buttons";
import ToolForm from "./components/toolForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      datas: null,
      currentNodeId: "",
      treeData: [
        {
          title: "地图工具",
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
            sortable: true,
            key: "name",
            align: "center"
          },
          {
            title: "标签",
            key: "label",
            align: "center"
          },
          {
            title: "类型",
            key: "type",
            align: "center"
          },
          {
            title: "顺序",
            key: "order",
            maxWidth: 70,
            align: "center"
          },
          {
            title: "是否可见",
            key: "visible",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.visible);
            }
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
  mounted() {
    this.loadTree();
  },
  methods: {
    renderTreeNode(h, { root, node, data }) {
      return renderHelper.renderDefaultNodeForTree(
        h,
        { root: root, node: node, data: data },
        this.selectionClick,
        this.$refs.tree
      );
    },
    //获取工具列表
    loadTree() {
      Server.get({
        url: services.getMapToolGetAllTree(this.AppId, this.IP)
      }).then(rsp => {
        if (rsp.status === 1) {
          let result = renderHelper.findNodeChildren(
            { children: rsp.data },
            this.currentNodeId
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
    selectionClick(node) {
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
    //根据父节点加载表格
    loadTable(toolId) {
      Server.get({
        url: services.getMapToolGetSubTools(this.AppId, this.IP),
        params: {
          toolId: toolId,
          appid: this.AppId
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.table.data = rsp.data;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //新增
    onAdd() {
      if (!this.currentNodeId) {
        this.$Message.warning("请选择一个节点");
        return;
      }
      this.showDialog = true;
      this.datas = null;
      this.$refs.toolForm.resetForm();
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
              url: services.getMapToolDelete(this.AppId, this.IP) + currentRow.id
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
    //修改
    onEdit(currentRow, index) {
      this.datas = currentRow;
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.toolForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    //更新树和表格
    onRefresh() {
      this.loadTree();
    },
    //保存
    onSave() {
      let form = this.$refs.toolForm.getForm();
      Server.post({
        url: services.getMapToolExecute(this.AppId, this.IP),
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
    }
  },
  components: {
    ToolForm,
    SearchButtons,
    ModalFooter
  }
};
</script>