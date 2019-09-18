<template>
  <div class="page-style">
    <div class="search-header">
      <span>URL：</span>
      <Input clearable class="search-input-default" v-model="searchName" @on-enter="onSearch" />
      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_defaultHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" width="480" title="URL管理">
      <url-form ref="urlForm" :datas="datas"></url-form>
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
import UrlForm from "./components/urlForm";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      datas: null,
      searchName: "",
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "Appid",
            key: "appid",
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
            key: "lable",
            align: "center"
          },
          {
            title: "urlPrefix",
            key: "urlPrefix",
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
        url: services.getUrlQuery(this.AppId, this.IP),
        params: {
          name: this.searchName
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
      this.$refs.urlForm.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.datas = currentRow;
        this.$refs.urlForm.editForm(currentRow);
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
              url: services.getUrlDelete(this.AppId, this.IP) + currentRow.id
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
      let form = this.$refs.urlForm.getForm();
      Server.post({
        url: services.getUrlExecute(this.AppId, this.IP),
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
    UrlForm
  }
};
</script>