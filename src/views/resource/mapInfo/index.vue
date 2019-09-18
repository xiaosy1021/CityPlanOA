<template>
  <div class="page-style">
    <div class="search-header">
      <span>名称：</span>
      <Input clearable class="search-input-default" v-model="searchName" @on-enter="onSearch" />
      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>
    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_defaultHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <Modal v-model="showDialog" :mask-closable="false" width="480" title="地图信息">
      <map-form ref="mapForm" :datas="datas" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
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
import SearchButtons from "@/components/search-buttons";
import MapForm from "./components/mapForm.vue";

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
            key: "name",
            sortable: true,
            align: "center"
          },
          {
            title: "地图范围",
            key: "extent",
            align: "center"
          },
          {
            title: "空间参考",
            key: "spatialReference",
            minWidth: 200,
            align: "center"
          },
          {
            title: "Tokens",
            key: "tokens",
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
        url: services.getMapInfoQuery(this.AppId, this.IP),
        params: {
          name: this.searchName
        }
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.status === 1) {
          this.table.data = rsp.data;
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
      this.$refs.mapForm.resetForm();
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        Message.warning("请选择需要操作的行");
      } else {
        this.datas = currentRow;
        this.$refs.mapForm.editForm(currentRow);
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
              url: services.getMapInfoDelete(this.AppId, this.IP) + currentRow.id
            }).then(rsp => {
              if (rsp.status == 1) {
                this.$Message.success("删除成功");
                this.onRefresh();
              } else {
                Message.error(rsp.message);
              }
            });
          },
          onCancel: () => {}
        });
      }
    },
    //保存
    onSave() {
      let form = this.$refs.mapForm.getForm();
      Server.post({
        url: services.getMapInfoExecute(this.AppId, this.IP),
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
    MapForm
  }
};
</script>