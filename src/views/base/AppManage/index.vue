<template>
  <div class="page-style">
    <div class="search-header">
      <span>APP名称：</span>
      <Input clearable class="search-input-default" v-model="searchAppId" @on-enter="onSearch" />
      <span>标签：</span>
      <Input clearable class="search-input-default" v-model="searchLabel" @on-enter="onSearch" />
      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_defaultHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" width="480" title="APP管理">
      <app-form ref="appForm" :datas="datas"></app-form>
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog"></modal-footer>
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
import SearchButtons from "@/components/search-buttons";
import AppForm from "./components/appForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      datas: null,
      searchLabel: "",
      searchAppId: "",
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "Appid",
            key: "appId",
            sortable: true,
            align: "center"
          },
          {
            title: "用户名",
            key: "userName",
            align: "center"
          },
          {
            title: "库类型",
            key: "databaseType",
            align: "center"
          },
          {
            title: "标签",
            key: "label",
            align: "center"
          },
          {
            title: "连接信息",
            minWidth: 100,
            key: "connectionString",
            align: "center"
          },
          {
            title: "启用短信（PC端）",
            key: "isEnableSMS",
            maxWidth: 100,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.isEnableSMS);
            }
          },
          {
            title: "启用短信（移动端）",
            key: "isEnableSMS_mt",
            maxWidth: 100,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(
                h,
                params.row.isEnableSMS_mt
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
    this.getTable();
  },
  methods: {
    getTable() {
      this.isLoading = true;
      Server.get({
        url: services.getAppQuery(this.IP),
        params: {
          appids: this.searchAppId,
          label: this.searchLabel
        }
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.status === 1) {
          this.table.data = rsp.data.rcds;
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
      this.onRefresh();
    },
    //增加
    onAdd() {
      this.showDialog = true;
      this.datas = null;
      this.$refs.appForm.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.datas = currentRow;
        this.$refs.appForm.editForm(currentRow);
        this.showDialog = true;
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
              url: services.getAppDelete(this.AppId, this.IP) + currentRow.id
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
      let form = this.$refs.appForm.getForm();
      Server.post({
        url: services.getAppExecute(this.AppId, this.IP),
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
    AppForm
  }
};
</script>