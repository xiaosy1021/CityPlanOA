<template>
  <div class="page-style">
    <div class="search-header">
      <Form ref="formInline" :model="formSearch" inline :label-width="80">
        <FormItem label="申请内容：">
          <Input
            class="search-input-default"
            clearable
            v-model="formSearch.content"
            @on-enter="onSearch"
          />
        </FormItem>
        <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
      </Form>
    </div>

    <div class="main-table-section">
      <FillTable
        ref="table"
        :fill="true"
        style="width:100%;height:100%"
        :loading="isLoading"
        border
        :columns="table.columns"
        :data="table.data"
      ></FillTable>
    </div>

    <div class="foot-page">
      <Page
        :total="total"
        :page-size="pageSize"
        show-total
        @on-change="pageChanged"
        @on-page-size-change="pageSizeChanged"
        show-sizer
        show-elevator
      ></Page>
    </div>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { CONSTCFG } from "@/core/const";
import { renderHelper } from "@/core/common";
import { treeDicHelper } from "@/core/TreeDictionary";
import SearchButtons from "@/components/search-buttons";
import FillTable from "@/components/FillTable.js";

export default {
  components: {
    SearchButtons,
    FillTable
  },
  props: {},
  data() {
    return {
      showDialog: false,
      showRelated: false,
      isLoading: false,
      formSearch: {
        content: ""
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      table: {
        columns: [
          {
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "项目号",
            key: "projectNo",
            width: 150,
            sortable: true,
            align: "center"
          },
          {
            title: "申请号",
            key: "applicationNo",
            width: 150,
            sortable: true,
            align: "center"
          },
          {
            title: "申请类型",
            key: "applicationType",
            width: 300,
            sortable: true,
            align: "center"
          },
          {
            title: "申请单位",
            key: "applicationCompanyName",
            width: 180,
            sortable: true,
            align: "center"
          },
          {
            title: "设计单位",
            key: "designCompanyName",
            width: 180,
            sortable: true,
            align: "center"
          },
          {
            title: "申请内容",
            key: "content",
            width: 420,
            sortable: true,
            align: "center"
          },

          {
            title: "操作",
            key: "action",
            width: 150,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderDefaultOpterForTable(
                h,
                params,
                this.onEdit,
                this.onDelete
              );
            },
            fixed: "right"
          },
          {
            title: "相关申请",
            key: "action",
            width: 100,
            align: "center",
            render: (h, params) => {
              return renderHelper.renderConfigButtonForTable(
                h,
                params,
                this.onViewRelated
              );
            },
            fixed: "right"
          },
          //多配置一个title为空格的列，以用于填充空白区域（列数较少时需要）
          {
            title: " ",
            key: "",
            align: "center"
          }
        ],
        data: []
      },
      layerIndex: ""
    };
  },
  created() {},
  mounted() {
    this.loadTable();
    pubsub.subscribe("closePage", () => {
      layer.close(this.layerIndex);
      this.loadTable();
    });
  },
  watch: {},
  computed: {},
  methods: {
    pageChanged(value) {
      this.pageIndex = value;
      this.loadTable();
    },
    pageSizeChanged(value) {
      this.pageSize = value;
      this.loadTable();
    },
    loadTable() {
      this.isLoading = true;
      let formSearch = Object.assign({}, this.formSearch);
      formSearch.page = this.pageIndex;
      formSearch.pageSize = this.pageSize;
      Server.get({
        url: services.data.application,
        params: formSearch
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.success === true) {
          this.total = rsp.result.totalCount;

          this.table.data = [];
          for (var i = 0; i < rsp.result.items.length; i++) {
            var item = rsp.result.items[i];

            var lblApplicationType = treeDicHelper.getDisplayByRSearchTree(
              item.applicationTypeCode,
              "322019000"
            );

            this.table.data.push({
              id: item.id,
              projectId: item.projectId,
              projectNo: item.projectNo,
              // projectName: item.project && item.project.name?item.project.name:'未返回...',
              applicationNo: item.applicationNo,
              applicationTypeCode: item.applicationTypeCode,
              applicationType: lblApplicationType,
              content: item.content,

              applicationCompany: item.applicantCompany,
              applicationCompanyName: item.applicantCompany.name,
              designCompany: item.designCompany,
              designCompanyName: item.designCompany.name
            });
          }
        } else {
          this.$Message.error(rsp.error.message);
        }
      });
    },

    //刷新
    onRefresh() {
      this.loadTable();
    },
    //查询
    onSearch() {
      this.pageIndex = 1;
      this.loadTable();
    },
    //新增
    onAdd() {
      this.showDialog = true;
      this.layerIndex = layer.open({
        type: 2,
        title: "新增/编辑 申请",
        content: "/#/addOrEditApplication",
        area: ["80%", "80%"],
        maxmin: true,
        success: function(layero, index) {
          pubsub.publish("resetForm");
        }
      });
    },
    //编辑
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.layerIndex = layer.open({
          type: 2,
          title: "新增/编辑 申请",
          content: "/#/addOrEditApplication",
          area: ["80%", "80%"],
          maxmin: true,
          success: function(layero, index) {
            pubsub.publish("editForm", currentRow);
          }
        });
      }
    },

    //删除
    onDelete(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要删除的行");
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "确定删除该记录?",
          onOk: () => {
            Server.delete({
              url: services.data.application + "/" + currentRow.id
            }).then(rsp => {
              if (rsp.success == true) {
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
    onViewRelated(currentRow, index) {
      this.$Message.error("开发中...");
      // if (!currentRow) {
      //     this.$Message.warning("请选择需要操作的行");
      // } else {
      //     this.templateName = currentRow.templateName;
      //     this.currentRowId = currentRow.id;
      //     this.showRelated = true;
      // }
    },
    //保存
    onSave() {
      this.$refs.frmAddOrEdit.$refs["frmData"].validate(valid => {
        if (valid) {
          let form = this.$refs.frmAddOrEdit.getForm();

          if (!form.id || form.id < 0) {
            Server.postJSON({
              url: services.data.application,
              params: JSON.stringify(form),
              headers: {
                "Content-Type": "application/json-patch+json"
              }
            })
              .then(rsp => {
                if (rsp.success === true) {
                  this.$Message.success("操作成功");
                  this.onRefresh();
                  this.showDialog = false;
                } else {
                  this.$Message.error(rsp.error.message);
                }
              })
              .catch(err => {
                this.$Message.error(err.message);
              });
          } else {
            Server.putJSON({
              url: services.data.application,
              params: JSON.stringify(form),
              headers: {
                "Content-Type": "application/json-patch+json"
              }
            })
              .then(rsp => {
                if (rsp.success === true) {
                  this.$Message.success("操作成功");
                  this.onRefresh();
                  this.showDialog = false;
                } else {
                  this.$Message.error(rsp.error.message);
                }
              })
              .catch(err => {
                this.$Message.error(err.message);
              });
          }
        }
      });
    },

    //取消
    onCancelDialog() {
      this.showDialog = false;
    }
  }
};
</script>
<style lang="less" scoped>
</style>