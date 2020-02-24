<template>
  <div class="page-style">
    <div class="search-header">
      <span>申请内容：</span>
      <Input class="search-input-default" clearable v-model="searchContent" @on-enter="onSearch" />

      <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
    </div>

    <div class="main-table-section">
      <Table :loading="isLoading" border :height="w_paginationHeight" :columns="table.columns" :data="table.data">
      </Table>
    </div>

    <div class="foot-page">
      <Page :total="total" :page-size="pageSize" show-total @on-change="pageChanged"
        @on-page-size-change="pageSizeChanged" show-sizer show-elevator></Page>
    </div>

    <Modal v-model="showDialog" :mask-closable="false" width="980" title="新增/编辑 申请">
      <AddOrEditForm ref="frmAddOrEdit" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
    </Modal>

  </div>
</template>

<script>
  import Server from "@/core/server";
  import {
    services
  } from "@/core/services";
  import {
    CONSTCFG
  } from "@/core/const";
  import {
    computeh
  } from "@/core/computeh";
  import {
    renderHelper
  } from "@/core/common";
  import {
    treeDicHelper
  } from "@/core/TreeDictionary";
  import SearchButtons from "@/components/search-buttons";

  import ModalFooter from "@/components/modal-footer";
  import AddOrEditForm from "./components/AddOrEditForm.vue";


  export default {
    mixins: [computeh],
    components: {
      SearchButtons,
      ModalFooter,
      AddOrEditForm
    },
    props: {},
    data() {
      return {
        showDialog: false,
        showRelated: false,
        isLoading: false,

        searchContent: "",

        pageIndex: 1,
        pageSize: 10,
        total: 0,
        table: {
          columns: [{
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
            // {
            //   title: "项目名称",
            //   key: "projectName",
            //   width: 150,
            //   sortable: true,
            //   align: "center"
            // },
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
              fixed: 'right'
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
              fixed: 'right'
            },
            //多配置一个title为空格的列，以用于填充空白区域（列数较少时需要）
            {
              title: " ",
              key: "",
              align: "center",
            }
          ],
          data: []
        }
      }
    },
    created() {},
    mounted() {
      this.loadTable();
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
        let content = this.searchContent;
        let pageIndex = this.pageIndex;
        let pageSize = this.pageSize;


        Server.get({
          url: services.data.application +
            `?content=${content}&IncludeProject=true&page=${pageIndex}&pageSize=${pageSize}`
        }).then(rsp => {
          this.isLoading = false;
          if (rsp.success === true) {
            this.total = rsp.result.totalCount;

            this.table.data = [];
            for (var i = 0; i < rsp.result.items.length; i++) {
              var item = rsp.result.items[i];

              var lblApplicationType = treeDicHelper.getDisplayByRSearchTree(item.applicationTypeCode,'322019000');

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
                designCompanyName: item.designCompany.name,

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
        this.$refs.frmAddOrEdit.resetForm();
      },
      //编辑
      onEdit(currentRow, index) {
        if (!currentRow) {
          this.$Message.warning("请选择需要操作的行");
        } else {
          this.$refs.frmAddOrEdit.editForm(currentRow);
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
        this.$refs.frmAddOrEdit.$refs['frmData'].validate((valid) => {
          if (valid) {
            let form = this.$refs.frmAddOrEdit.getForm();

            if (!form.id || form.id < 0) {
              Server.postJSON({
                url: services.data.application,
                params: JSON.stringify(form),
                headers: {
                  'Content-Type': "application/json-patch+json"
                }
              }).then(rsp => {
                if (rsp.success === true) {
                  this.$Message.success("操作成功");
                  this.onRefresh();
                  this.showDialog = false;
                } else {
                  this.$Message.error(rsp.error.message);
                }
              }).catch(err => {
                this.$Message.error(err.message);
              });
            } else {
              Server.putJSON({
                url: services.data.application,
                params: JSON.stringify(form),
                headers: {
                  'Content-Type': "application/json-patch+json"
                }
              }).then(rsp => {
                if (rsp.success === true) {
                  this.$Message.success("操作成功");
                  this.onRefresh();
                  this.showDialog = false;
                } else {
                  this.$Message.error(rsp.error.message);
                }
              }).catch(err => {
                this.$Message.error(err.message);
              });
            }
          }
        })
      },

      //取消
      onCancelDialog() {
        this.showDialog = false;
      },
    },
  }
</script>
<style lang="less" scoped>
</style>