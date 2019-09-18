<template>
  <div class="page-style">
    <div class="roleHeer search-header">
      <span>角色名：</span>
      <Input clearable class="search-input-default" v-model="searchName" @on-enter="onSearch" />
      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_defaultHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" title="角色管理">
      <role-form ref="roleform"></role-form>
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
import RoleForm from "./components/roleForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      searchName: "",
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "角色名",
            sortable: true,
            key: "name",
            align: "center"
          },
          {
            title: "描述",
            key: "description",
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
        url: services.getRoleQuery(this.AppId, this.IP),
        params: {
          name: this.searchName
        }
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
    onSearch() {
      this.onRefresh();
    },
    //增加
    onAdd() {
      this.showDialog = true;
      this.$refs.roleform.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        var form = this.$refs.roleform.editForm(currentRow);
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
              url: services.getRoleDelete(this.AppId, this.IP) + currentRow.id
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
      var form = this.$refs.roleform.getForm();
      if (form.name == "") {
        this.showDialog = true;
        this.$Message.warning("请填写角色名称");
      } else {
        Server.post({
          url: services.getRoleExecute(this.AppId, this.IP),
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
    RoleForm
  }
};
</script>