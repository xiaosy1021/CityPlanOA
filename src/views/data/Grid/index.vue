<template>
  <div class="page-style">
    <div class="search-header">
      <span>Grid名称：</span>
      <Input clearable class="search-input-default" v-model="searchTemplateName" @on-enter="onSearch" />
      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_paginationHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <div class="foot-page">
      <Page :total="total" :page-size="pageSize" show-total @on-change="handlePage"></Page>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" width="480" title="Grid管理">
      <grid-form ref="GridForm" :datas="datas" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
    </Modal>
    <Modal width="1210px" v-model="showProp" title="Grid属性配置">
      <grid-prop ref="prop" :templateName="templateName" :id="currentRowId" v-if="showProp" />
      <modal-footer slot="footer" @on-save="onSaveProp" @on-cancel="onCancelProp" />
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { computeh } from "@/core/computeh";
import { routerparams } from "@/core/mixins/routerp";
import { renderHelper } from "@/core/common";
import ModalFooter from "@/components/modal-footer";
import GridForm from "./components/GridForm.vue";
import GridProp from "./components/moudelprop.vue";
import SearchButtons from "@/components/search-buttons";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      showProp: false,
      isLoading: false,
      templateName: "",
      searchTemplateName: "",
      currentRowId: "",
      datas: null,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "Grid名称",
            sortable: true,
            key: "gridName",
            align: "center"
          },
          {
            title: "Grid标签",
            key: "label",
            align: "center"
          },
          {
            title: "模板",
            key: "templateName",
            align: "center"
          },
          {
            title: "二次查询",
            key: "qurl",
            align: "center"
          },
          {
            title: "顺序",
            key: "order",
            align: "center"
          },
          {
            title: "操作",
            key: "action",
            maxWidth: 150,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderDefaultOpterForTable(
                h,
                params,
                this.onEdit,
                this.onDelete
              );
            }
          },
          {
            title: "属性配置",
            key: "action",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderConfigButtonForTable(
                h,
                params,
                this.onShowProp
              );
            }
          }
        ],
        data: []
      }
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
    handlePage(value) {
      this.pageNum = value;
      this.getTable();
    },
    getTable() {
      this.isLoading = true;
      let pageNumber = this.pageNum;
      let pageSize = this.pageSize;
      let templateName = this.searchTemplateName;
      Server.get({
        url:
          services.getQueryGridTmplQuery(this.AppId, this.IP) +
          `&templateName=${templateName}&page=${pageNumber}&pageSize=${pageSize}`
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.status === 1) {
          this.table.data = rsp.data.rcds;
          this.total = rsp.data.total;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //刷新
    onRefresh() {
      this.getTable();
    },
    onSearch() {
      this.pageNum = 1;
      this.getTable();
    },
    //增加
    onAdd() {
      this.showDialog = true;
      this.datas = null;
      this.$refs.GridForm.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.datas = currentRow;
        this.$refs.GridForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    onShowProp(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.templateName = currentRow.templateName;
        this.currentRowId = currentRow.id;
        this.showProp = true;
      }
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
                services.getQueryGridTmplDelete(this.AppId, this.IP) +
                currentRow.id
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
    //保存
    onSave() {
      let form = this.$refs.GridForm.getForm();
      Server.post({
        url: services.getQueryGridTmplExecute(this.AppId, this.IP),
        params: {
          params: JSON.stringify(form)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("操作成功");
          this.onRefresh();
          this.showDialog = false;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //取消
    onCancelDialog() {
      this.showDialog = false;
    },
    onSaveProp() {
      let tableData = this.$refs.prop.getProp();
      if (
        tableData.filter(item => {
          return !item.name;
        }).length > 0
      ) {
        this.$Message.warning("名称不可为空");
        return;
      }
      Server.post({
        url: services.getQueryGridTmplAttrSave(this.AppId, this.IP),
        params: {
          params: JSON.stringify(tableData)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("操作成功");
          this.showProp = false;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    onCancelProp() {
      this.showProp = false;
    }
  },
  components: {
    ModalFooter,
    GridProp,
    SearchButtons,
    GridForm
  }
};
</script>