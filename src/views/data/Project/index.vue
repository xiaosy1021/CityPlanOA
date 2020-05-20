<template>
  <div class="page-style">
    <div class="search-header">
      <Form ref="formInline" :model="formSearch" inline :label-width="80">
        <FormItem label="项目名称：">
          <Input
            class="search-input-default"
            clearable
            v-model="formSearch.name"
            @on-enter="onSearch"
          />
        </FormItem>
        <FormItem label="项目类型：">
          <Select v-model="formSearch.projectType" class="search-input-default" style="width:200px">
            <Option
              v-for="item in dataProjType"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="项目集：">
          <Input
            class="search-input-default"
            clearable
            v-model="formSearch.projectRootNo"
            @on-enter="onSearch"
          />
        </FormItem>
        <FormItem label="项目号：">
          <Input
            class="search-input-default"
            clearable
            v-model="formSearch.projectNo"
            @on-enter="onSearch"
          />
        </FormItem>
        <search-buttons @on-search="onSearch" @on-refresh="onRefresh" @on-add="onAdd"></search-buttons>
      </Form>
    </div>
    <div class="main-table-section" id="test">
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

    <Modal v-model="showDialog" :mask-closable="false" width="680" title="新增/编辑 项目">
      <AddOrEditForm ref="frmAddOrEdit" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { CONSTCFG } from "@/core/const";
import { renderHelper } from "@/core/common";
import SearchButtons from "@/components/search-buttons";

import ModalFooter from "@/components/modal-footer";
import AddOrEditForm from "./components/AddOrEditForm.vue";

import FillTable from "@/components/FillTable.js";
export default {
  components: {
    SearchButtons,
    ModalFooter,
    AddOrEditForm,
    FillTable
  },
  props: {},
  data() {
    return {
      formSearch: {
        name: "",
        projectType: "",
        projectRootNo: "",
        projectNo: ""
      },
      showDialog: false,
      showRelated: false,
      isLoading: false,

      dataProjType: [],

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
            title: "项目名称",
            key: "name",
            width: 180,
            sortable: true,
            align: "center"
          },
          {
            title: "项目号",
            key: "projectNo",
            width: 120,
            align: "center"
          },
          {
            title: "所属项目集",
            key: "projectRootNo",
            width: 180,
            align: "center"
          },
          {
            title: "项目内容",
            key: "content",
            width: 300,
            align: "center"
          },
          {
            title: "项目位置",
            key: "location",
            width: 300,
            align: "center"
          },
          {
            title: "项目类型",
            key: "projectTypeName",
            width: 200,
            align: "center"
          },
          {
            title: "项目子类型",
            key: "projectSubTypeName",
            width: 150,
            align: "center"
          },
          {
            title: "产权单位",
            key: "ownerCompanyName",
            width: 150,
            align: "center"
          },
          {
            title: "建设单位",
            key: "constructionCompanyName",
            width: 150,
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
      }
    };
  },
  created() {
    this.dataProjType.push({
      value: "all",
      label: "-- 全部 --"
    });

    for (var i = 0; i < CONSTCFG.DataProjType.length; i++) {
      this.dataProjType.push(CONSTCFG.DataProjType[i]);
    }
  },
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
      let formSearch = Object.assign({}, this.formSearch);
      formSearch.projectType = formSearch.projectType == "all" ? "" : formSearch.projectType;
      formSearch.page = this.pageIndex;
      formSearch.pageSize = this.pageSize;
      Server.get({
        url: services.data.project,
        params: formSearch
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.success === true) {
          this.table.data = [];
          for (var i = 0; i < rsp.result.items.length; i++) {
            var item = rsp.result.items[i];

            var projTypeObj = CONSTCFG.DataProjType.find(
              p => p.value == item.projectTypeCode
            );
            var projTypeName = projTypeObj ? projTypeObj.label : "";
            var projSubTypeObj = projTypeObj
              ? projTypeObj.children.find(
                  p => p.value == item.projectSubTypeCode
                )
              : null;
            var projSubTypeName = projSubTypeObj ? projSubTypeObj.label : "";

            this.table.data.push({
              id: item.id,
              name: item.name,
              projectNo: item.projectNo,
              projectRootId: item.projectRootId,
              projectRootNo: item.projectRootNo,
              location: item.location,
              content: item.content,
              projectTypeCode: item.projectTypeCode,
              projectTypeName: projTypeName,
              projectSubTypeCode: item.projectSubTypeCode,
              projectSubTypeName: projSubTypeName,
              ownerCompanyId: item.ownerCompany.id,
              ownerCompanyName: item.ownerCompany.name,
              ownerCompany: item.ownerCompany,
              constructionCompanyId: item.constructionCompany.id,
              constructionCompanyName: item.constructionCompany.name,
              constructionCompany: item.constructionCompany,
              landusageCode: item.landusageCode,
              landusage: item.landusage,
              landArea: item.landArea
            });
          }

          // this.table.data = rsp.result.items;
          this.total = rsp.result.totalCount;
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
              url: services.data.project + "/" + currentRow.id
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
          if (!form.projectTypeCode || !form.projectSubTypeCode) {
            this.$Message.error("请选择项目类型");
            return;
          }
          if (!form.projectRootId || !form.projectRootNo) {
            this.$Message.error("请选择项目集");
            return;
          }
          if (!form.landusageCode || !form.landusage) {
            this.$Message.error("请选择用地性质");
            return;
          }
          if (!form.constructionCompanyId || form.constructionCompanyId == -1) {
            this.$Message.error("请选择建设单位");
            return;
          }
          if (!form.ownerCompanyId || form.ownerCompanyId == -1) {
            this.$Message.error("请选择产权单位");
            return;
          }

          if (!form.id || form.id < 0) {
            Server.postJSON({
              url: services.data.project,
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
              url: services.data.project,
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