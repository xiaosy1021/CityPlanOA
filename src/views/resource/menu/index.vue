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
          border
          :height="w_splitTableHeight"
          :columns="table.columns"
          :data="table.data"
          :row-class-name="rowClass"
          @on-sort-change="onSort"
          @on-row-dblclick="onEdit"
        ></Table>
      </div>
      </Col>
      <Modal
        v-model="showDialog"
        :mask-closable="false"
        width="500"
        title="菜单管理"
      >
        <menu-form
          ref="menuForm"
          :parent-id="currentNodeId"
        />
        <modal-footer
          slot="footer"
          @on-save="onSave"
          @on-cancel="onCancelDialog"
        ></modal-footer>
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
import MenuForm from "./components/menuForm.vue";
import DragSupport from "@/core/mixins/dragSupport";
import "@/assets/css/drag.less";

export default {
  mixins: [computeh, routerparams, DragSupport],
  data() {
    return {
      showDialog: false,
      sortType: "",
      currentNodeId: "",
      treeData: [
        {
          title: "菜单管理",
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
            title: "链接",
            key: "targetUrl",
            minWidth: 80,
            align: "center"
          },
          {
            title: "样式",
            key: "viewStyle",
            align: "center"
          },
          {
            title: "图标",
            key: "icon",
            align: "center"
          },
          {
            title: "可见",
            key: "visible",
            maxWidth: 80,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.visible);
            }
          },
          {
            title: "默认初始",
            key: "initMenu",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.initMenu);
            }
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
      Server.get({
        url: services.getMenuGetAllTree(this.AppId, this.IP)
      }).then(rsp => {
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
    //根据父节点加载表格
    loadTable(menuId) {
      Server.get({
        url: services.getMenuGetSubMenus(this.AppId, this.IP),
        params: {
          menuId: menuId,
          appid: this.AppId
        }
      }).then(rsp => {
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
    //新增
    onAdd() {
      if (!this.currentNodeId) {
        this.$Message.warning("请选择一个节点");
        return;
      }
      this.showDialog = true;
      this.$refs.menuForm.resetForm();
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
              url: services.getMenuDelete(this.AppId, this.IP) + currentRow.id
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
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.menuForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    //更新树和表格
    onRefresh() {
      this.loadTree();
    },
    //保存
    onSave() {
      let form = this.$refs.menuForm.getForm();
      Server.post({
        url: services.getMenuExecute(this.AppId, this.IP),
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
          url: services.getMenuDrag(this.AppId, this.IP),
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
    MenuForm,
    SearchButtons,
    ModalFooter
  }
};
</script>