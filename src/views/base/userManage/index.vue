<template>
  <div class="page-style">
    <div class="search-header">
      <span>账号：</span>
      <Input class="search-input-default" clearable v-model="searchUserAccount" @on-enter="onSearch" />
      <span>用户名：</span>
      <Input class="search-input-default" clearable v-model="searchUserName" @on-enter="onSearch" />
      <span>单位：</span>
      <Input class="search-input-default" clearable v-model="searchCompany" @on-enter="onSearch" />
      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_defaultHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" width="600" title="用户管理">
      <user-form ref="userform" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelPerson"></modal-footer>
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
import UserForm from "./components/userForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      searchUserAccount: "",
      searchCompany: "",
      searchUserName: "",
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "账号",
            key: "userAccount",
            sortable: true,
            align: "center"
          },
          {
            title: "用户名",
            key: "userName",
            align: "center"
          },
          {
            title: "密码",
            key: "passWd",
            align: "center"
          },
          {
            title: "性别",
            key: "sex",
            maxWidth: 80,
            align: "center"
          },
          {
            title: "职务",
            key: "duty",
            align: "center"
          },
          {
            title: "单位",
            key: "company",
            align: "center"
          },
          {
            title: "部门",
            key: "department",
            align: "center"
          },
          {
            title: "手机",
            key: "phoneNumber",
            maxWidth: 150,
            align: "center"
          },
          {
            title: "电脑端",
            key: "isEnablePC",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.isEnablePC);
            }
          },
          {
            title: "移动端",
            key: "isEnableMobile",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(
                h,
                params.row.isEnableMobile
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
        url: services.getUserQuery(this.AppId, this.IP),
        params: {
          userAccount: this.searchUserAccount,
          userName: this.searchUserName,
          company: this.searchCompany
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
    //查询
    onSearch() {
      this.onRefresh();
    },
    //新增
    onAdd() {
      this.showDialog = true;
      this.$refs.userform.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.userform.editForm(currentRow);
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
              url: services.getUserDelete(this.AppId, this.IP) + currentRow.id
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
      var form = this.$refs.userform.getForm();
      if (form.userAccount == "" || form.userName === "" || form.passWd == "") {
        this.$Message.warning("请填写检查账户用户名或密码是否填写完整");
      } else {
        Server.post({
          url: services.getUserExecute(this.AppId, this.IP),
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
    onCancelPerson() {
      this.showDialog = false;
    }
  },
  components: {
    ModalFooter,
    SearchButtons,
    UserForm
  }
};
</script>