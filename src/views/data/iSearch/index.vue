<template>
  <div class="page-style">
    <div class="search-header">
      <span>模板名：</span>
      <Input
        class="search-input-default"
        clearable
        v-model="searchTemplateName"
        @on-enter="onSearch"
      />
      <search-buttons
        @on-search="onSearch"
        @on-refresh="onRefresh"
        @on-add="onAdd"
      ></search-buttons>
    </div>
    <div class="main-table-section">
      <Table
        :loading="isLoading"
        border
        :height="w_paginationHeight"
        :columns="table.columns"
        :data="table.data"
      ></Table>
    </div>
    <div class="foot-page">
      <Page
        :total="total"
        :page-size="pageSize"
        show-total
        @on-change="handlePage"
      ></Page>
    </div>
    <Modal
      v-model="showDialog"
      :mask-closable="false"
      width="680"
      title="List模板"
    >
      <i-search-form ref="iSearchForm" />
      <modal-footer
        slot="footer"
        @on-save="onSave"
        @on-cancel="onCancelDialog"
      />
    </Modal>
    <Modal
      width="1210px"
      v-model="showProp"
      title="i查询属性配置"
    >
      <i-search-prop
        ref="iSearchProp"
        :templateName="templateName"
        :id="currentRowId"
        v-if="showProp"
      />
      <modal-footer
        slot="footer"
        @on-save="onSaveProp"
        @on-cancel="onCancelProp"
      />
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
import iSearchForm from "./components/moudelForm.vue";
import iSearchProp from "./components/moudelprop.vue";
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
            title: "模板",
            key: "templateName",
            sortable: true,
            align: "center"
          },
          {
            title: "表名",
            key: "tableName",
            align: "center"
          },
          {
            title: "关键字",
            key: "keyId",
            align: "center"
          },
          {
            title: "名称",
            key: "keyName",
            align: "center"
          },
          {
            title: "类别",
            key: "categoryName",
            align: "center"
          },
          {
            title: "图形",
            key: "geoType",
            maxWidth: 80,
            align: "center"
          },
          {
            title: "其他数据源",
            key: "dataAppid",
            align: "center"
          },

          {
            title: "是否显示图形要素",
            key: "shape",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.shape);
            }
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
                this.onEditProp
              );
            }
          }
        ],
        data: []
      }
    };
  },
  activated() {
    this.searchTemplateName = this.$route.query.templateName || "";
    this.getTable();
  },
  mounted() {
    this.searchTemplateName = this.$route.query.templateName || "";
    this.getTable();
  },
  methods: {
    handlePage(value) {
      this.pageNum = value;
      this.getTable();
    },
    getTable() {
      this.isLoading = true;
      let templateName = this.searchTemplateName;
      let pageNumber = this.pageNum;
      let pageSize = this.pageSize;
      Server.get({
        url:
          services.getQueryListTmplQuery(this.AppId, this.IP) +
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
    //查询
    onSearch() {
      this.pageNum = 1;
      this.getTable();
    },
    //新增
    onAdd() {
      this.showDialog = true;
      this.currentRowId = "";
      this.$refs.iSearchForm.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.currentRowId = currentRow.id;
        this.$refs.iSearchForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    onEditProp(currentRow, index) {
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
                services.getQueryListTmplDelete(this.AppId, this.IP) +
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
      let form = this.$refs.iSearchForm.getForm();
      Server.post({
        url: services.getQueryListTmplExecute(this.AppId, this.IP),
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
    onSaveProp() {
      let tableData = this.$refs.iSearchProp.getProp();
      if (
        tableData.filter(item => {
          return !item.columnName;
        }).length > 0
      ) {
        this.$Message.warning("属性不可为空");
        return;
      }
      Server.post({
        url: services.getQueryListTmplAttrSave(this.AppId, this.IP),
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
    //取消
    onCancelDialog() {
      this.showDialog = false;
    },
    onCancelProp() {
      this.showProp = false;
    }
  },
  components: {
    ModalFooter,
    SearchButtons,
    iSearchForm,
    iSearchProp
  }
};
</script>