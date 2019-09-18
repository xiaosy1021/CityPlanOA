<template>
  <div class="page-style">
    <div class="search-header">
      <span>名称：</span>
      <Input
        clearable
        class="search-input-default"
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
        :height="w_defaultHeight"
        :columns="table.columns"
        :data="table.data"
      ></Table>
    </div>
    <Modal
      v-model="showDialog"
      :mask-closable="false"
      width="600"
      title="快查管理"
    >
      <quick-query-form
        ref="quickQueryForm"
        :datas="datas"
      ></quick-query-form>
      <modal-footer
        slot="footer"
        @on-save="onSave"
        @on-cancel="onCancelDialog"
      ></modal-footer>
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { computeh } from "@/core/computeh";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { renderHelper } from "@/core/common";
import ModalFooter from "@/components/modal-footer";
import SearchButtons from "@/components/search-buttons";
import QuickQueryForm from "./components/quickQueryForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      isLoading: false,
      searchName: "",
      datas: null,
      table: {
        columns: [
          {
            type: "index",
            width: 60,
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
            title: "服务地址",
            key: "url",
            minWidth: 100,
            align: "center"
          },
          {
            title: "默认值",
            key: "defaultValue",
            align: "center"
          },
          {
            title: "有效",
            maxWidth: 75,
            key: "isEnable",
            align: "center",
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.isEnable);
            }
          },
          {
            title: "备注",
            key: "remark",
            align: "center"
          },
          {
            title: "顺序",
            maxWidth: 75,
            key: "order",
            align: "center"
          },
          {
            title: "操作",
            key: "action",
            maxWidth: 150,
            minWidth: 60,
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
            title: "跳转",
            key: "action",
            maxWidth: 75,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderActionButtonForTable(
                h,
                params,
                this.toService
              );
            }
          },
          {
            title: "服务名称",
            key: "serviceKeyName",
            width: 100,
            align: "center",
            render: (h, params) => {
              let _this = this;
              return h("Input", {
                props: {
                  value: params.row.serviceKeyName
                },
                on: {
                  "on-blur": event => {
                    _this.table.data[params.row._index].serviceKeyName =
                      event.target.value;
                  }
                },
                style: {
                  display: "inline-block",
                  border: "0px"
                }
              });
            }
          },
          {
            title: "绑定",
            key: "action",
            maxWidth: 90,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderBindButtonForTable(
                h,
                params,
                this.onBind
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
      this.searchName = "";
      this.getTable();
    }
  },
  mounted() {
    this.getTable();
  },
  methods: {
    getTable() {
      this.isLoading = true;
      Server.get({
        url: services.getQuickQueryQuery(this.AppId, this.IP),
        params: {
          name: this.searchName
        }
      }).then(rsp => {
        this.isLoading = false;
        this.table.data = rsp.data.rcds;
      });
    },
    //刷新
    onRefresh() {
      this.getTable();
    },
    onSearch() {
      this.onRefresh();
    },
    onBind(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        Server.post({
          url: services.getServiceBinding(this.AppId, this.IP),
          params: {
            params: JSON.stringify({
              appid: currentRow.appid,
              servicename: currentRow.serviceKeyName,
              funid: currentRow.id
            })
          }
        }).then(rsp => {
          if (rsp.status === 1) {
            this.$Message.success("操作成功");
          } else {
            this.$Message.error(rsp.message);
          }
        });
      }
    },
    toService(currentRow, index) {
      this.$route.meta.noTrigger = true;
      this.$router.push({
        path: `/function/serviceManage/${this.IP}/${this.AppId}`,
        query: {
          name: currentRow.serviceKeyName
        }
      });
    },
    //增加
    onAdd() {
      this.showDialog = true;
      this.datas = null;
      this.$refs.quickQueryForm.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.datas = currentRow;
        this.$refs.quickQueryForm.editForm(currentRow);
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
              url:
                services.getQuickQueryDelete(this.AppId, this.IP) +
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
      let form = this.$refs.quickQueryForm.getForm();
      Server.post({
        url: services.getQuickQueryExecute(this.AppId, this.IP),
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
    QuickQueryForm
  }
};
</script>