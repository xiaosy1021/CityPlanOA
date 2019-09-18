<template>
  <div class="page-style">
    <div class="search-header">
      <span>服务名称：</span>
      <Input
        class="search-input-default"
        clearable
        v-model="searchName"
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
        :columns="table.columns"
        :height="w_paginationHeight"
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
      title="服务管理"
    >
      <service-form
        ref="serviceForm"
        :datas="datas"
        @on-close="showDialog = false"
      />
      <modal-footer
        slot="footer"
        @on-save="onSave"
        @on-cancel="onCancelDialog"
      />
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { computeh } from "@/core/computeh";
import { renderHelper } from "@/core/common";
import ModalFooter from "@/components/modal-footer";
import ServiceForm from "./components/serviceForm.vue";
import SearchButtons from "@/components/search-buttons";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      searchName: "",
      pageSize: 10,
      pageNum: "",
      total: 0,
      datas: null,
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "标签",
            key: "label",
            sortable: true,
            align: "center"
          },
          {
            title: "名称",
            key: "name",
            align: "center"
          },
          {
            title: "模板",
            key: "templateName",
            align: "center"
          },
          {
            title: "消息类型",
            key: "msgType",
            align: "center"
          },
          {
            title: "参数",
            key: "isAddPara",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.isAddPara);
            }
          },
          {
            title: "可见",
            key: "visible",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.visible);
            }
          },
          {
            title: "追加用户",
            key: "addUserAccount",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(
                h,
                params.row.addUserAccount
              );
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
                this.onRowClick,
                this.remove
              );
            }
          }
        ],
        data: []
      }
    };
  },
  activated() {
    if (this.$route.meta.noTrigger === true) {
      this.$route.meta.noTrigger = false;
    } else {
      this.searchName = this.$route.query.name || "";
      this.onSearch();
    }
  },
  mounted() {
    this.searchName = this.$route.query.name || "";
    this.onSearch();
  },
  methods: {
    handlePage(value) {
      this.pageNum = value;
      this.getTable();
    },
    getTable() {
      this.isLoading = true;
      let name = this.searchName;
      let pageNumber = this.pageNum;
      let pageSize = this.pageSize;
      Server.get({
        url:
          services.getServiceQuery(this.AppId, this.IP) +
          `&name=${name}&page=${pageNumber}&pageSize=${pageSize}`
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
    onChangePage(page) {
      this.initData(page);
    },
    //新增
    onAdd() {
      this.showDialog = true;
      this.datas = null;
      this.$refs.serviceForm.resetForm();
    },
    //编辑
    onRowClick(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.datas = currentRow;
        this.$refs.serviceForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    //删除
    remove(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要删除的行");
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "是否永久删除此数据?",
          onOk: () => {
            Server.get({
              url:
                services.getServiceDelete(this.AppId, this.IP) + currentRow.id
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
      let form = this.$refs.serviceForm.getForm();
      Server.post({
        url: services.getServiceExecute(this.AppId, this.IP),
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
    }
  },
  components: {
    ModalFooter,
    SearchButtons,
    ServiceForm
  }
};
</script>