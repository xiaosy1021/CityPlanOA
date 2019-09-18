<template>
  <div class="page-style">
    <div class="search-header">
      <search-buttons :showSearch="false" @on-refresh="getTable" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table border :loading="isLoading" :columns="table.columns" :height="w_defaultHeight" :data="table.data"></Table>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" width="480" title="Token管理">
      <token-form ref="tokenform"></token-form>
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
import TokenForm from "./components/tokenForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      table: {
        columns: [
          {
            type: "index",
            width: 60,
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
            title: "服务地址",
            key: "url",
            align: "center"
          },
          {
            title: "备注",
            key: "remark",
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
        url: services.getTokenQuery(this.AppId, this.IP),
        params: {}
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.status === 1) {
          this.table.data = rsp.data.rows;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //刷新
    onRefresh() {
      this.getTable();
    },
    //增加
    onAdd() {
      this.showDialog = true;
      this.$refs.tokenform.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.tokenform.editForm(currentRow);
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
              url: services.getTokenDelete(this.AppId, this.IP) + currentRow.id
            }).then(rsp => {
              if (rsp.status == 1) {
                this.$Message.success("删除成功");
                this.onRefresh();
              } else {
                this.$Message.error(rsp.message);
              }
            });
          },
          onCancel: () => {
          }
        });
      }
    },
    //保存
    onSave() {
      let form = this.$refs.tokenform.getForm();
      if (form.label == "" || form.url == "") {
        this.$Message.warning("请填写完整的标签和url");
      } else {
        Server.post({
          url: services.getTokenExecute(this.AppId, this.IP),
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
      }
    },
    //取消
    onCancelDialog() {
      this.showDialog = false;
    }
  },
  components: {
    ModalFooter,
    SearchButtons,
    TokenForm
  }
};
</script>