<template>
  <div>
    <div class="btn-right-top">
      <Button type="primary" @click="onAdd()">新增</Button>
    </div>

    <div class="main-table-section">
      <Table
        :loading="isLoading"
        border
        max-height="280"
        :columns="table.columns"
        :data="table.data"
      >
        <template slot-scope="{ row,index}" slot="document">
          <div class="tools-container">
            <Button shape="circle" icon="ios-eye" title="打开文件" @click="handleOpenFile(row)"></Button>
            <Button
              shape="circle"
              icon="ios-cloud-download"
              title="文件下载"
              @click="handleDownload(row,index)"
            ></Button>
          </div>
        </template>
      </Table>
    </div>

    <Modal v-model="showDialog" :mask-closable="false" width="680" title="新增/编辑 文档">
      <UploadDocForm ref="frmAddOrEditDoc" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { CONSTCFG } from "@/core/const";
import { renderHelper } from "@/core/common";
import { treeDicHelper } from "@/core/TreeDictionary";

import ModalFooter from "@/components/modal-footer";
import UploadDocForm from "./UploadDocForm.vue";
import { cadcall } from "../js/cadcall.js";
export default {
  components: {
    ModalFooter,
    UploadDocForm
  },
  props: {
    projectId: {
      type: Number,
      default: -1
    },
    projectNo: {
      type: String,
      default: ""
    },

    applicationId: {
      type: Number,
      default: -1
    },
    applicationNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showDialog: false,
      isLoading: false,

      //文档类型 级联选择
      dataDocType: [],

      table: {
        columns: [
          {
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },

          {
            title: "文件名",
            key: "fileName",
            width: 150,
            sortable: true,
            align: "center"
          },
          {
            title: "文档类型",
            key: "docType",
            width: 230,
            sortable: true,
            align: "center"
          },
          {
            title: "备注",
            key: "remark",
            width: 250,
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
            title: "下载",
            key: "action",
            width: 120,
            align: "center",
            slot: "document",
            // render: (h, params) => {
            //   return renderHelper.renderDownloadButtonForTable(
            //     h,
            //     params,
            //     this.handleDownload
            //   );
            // },
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
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    applicationId() {
      if (this.applicationId > 0) {
        this.loadTable();
      }
    }
  },
  computed: {
    // ...mapGetters("oidcStore", ["oidcAccessToken"])
  },
  methods: {
    init() {
      this.dataDocType = CONSTCFG.DataDocType;
    },

    loadTable() {
      this.isLoading = true;

      Server.get({
        url: services.data.application + `/` + this.applicationId + `/documents`
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.success === true) {
          this.table.data = [];
          for (var i = 0; i < rsp.result.length; i++) {
            var item = rsp.result[i];

            var valueDocType = treeDicHelper.getArrValueByRSearchTree(
              item.docSubTypeCode,
              "4010000-0"
            );
            var txtDocType = treeDicHelper.getDisplayByRSearchTree(
              item.docSubTypeCode,
              "4010000-0"
            );

            this.table.data.push({
              id: item.id,
              projectId: item.projectId,
              projectNo: item.projectNo,
              applicationId: item.applicationId,
              applicationNo: item.applicationNo,
              fileName: item.fileName,
              remark: item.remark,
              docTypeCode: item.docTypeCode,
              docSubTypeCode: item.docSubTypeCode,

              docType: txtDocType,
              valueDocType: valueDocType
            });
          }
        } else {
          this.$Message.error(rsp.error.message);
        }
      });
    },

    onAdd() {
      this.showDialog = true;
      this.$refs.frmAddOrEditDoc.resetForm(
        this.projectId,
        this.projectNo,
        this.applicationId,
        this.applicationNo
      );
    },
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.frmAddOrEditDoc.editForm(currentRow);
        this.showDialog = true;
      }
    },

    onDelete(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要删除的行");
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "确定删除该记录?",
          onOk: () => {
            Server.delete({
              url: services.data.documents + "/" + currentRow.id
            }).then(rsp => {
              if (rsp.success == true) {
                this.$Message.success("删除成功");
                this.loadTable();
              } else {
                this.$Message.error(rsp.message);
              }
            });
          },
          onCancel: () => {}
        });
      }
    },

    handleDownload(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要下载的文档");
      } else {
        Server.getDownloadFile({
          url: services.data.documents + "/" + currentRow.id + "/download",
          fileName: currentRow.fileName
        });
      }
    },

    handleOpenFile(currentRow, index) {
      let _self=this;
      if (!currentRow) {
        this.$Message.warning("请选择需要下载的文档");
      } else {
        cadcall.openRemote(
          `curl -X GET "${services.data.documents}/${currentRow.id}/download" -H "authorization:Bearer ${Server._token}"`,
          function(rsp) {
            _self.$Message.info(rsp.Message);
          }
        );
      }
    },

    onSave() {
      this.$refs.frmAddOrEditDoc.$refs["frmData"].validate(valid => {
        if (valid) {
          let form = this.$refs.frmAddOrEditDoc.getForm();
          if (!form.id || form.id < 0) {
            if (form.file == null) {
              this.$Message.error("请选择上传文档！");
            }

            Server.postFormData({
              url: services.data.documents,
              params: form,
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }).then(rsp => {
              if (rsp.status == 200) {
                this.$Message.success("操作成功");
                this.loadTable();
                this.showDialog = false;
              } else {
                this.$Message.error(rsp.error.message);
              }
            });
          } else {
            var arrSrv = [];
            arrSrv.push(
              new Promise((resolve, reject) => {
                Server.putFormData({
                  url: services.data.documents,
                  params: form,
                  headers: {
                    "Content-Type": "application/json-patch+json"
                  }
                })
                  .then(rsp => {
                    if (rsp.status == 200) {
                      resolve(true);
                    } else {
                      this.$Message.error(rsp.error.message);
                      reject("更新文档信息失败！");
                    }
                  })
                  .catch(error => {
                    reject(error);
                  });
              })
            );

            if (form.file) {
              arrSrv.push(
                new Promise((resolve, reject) => {
                  Server.putFormData({
                    url: services.data.documents + "/" + form.id + "/upload",
                    params: form,
                    headers: {
                      "Content-Type": "multipart/form-data"
                    }
                  })
                    .then(rsp => {
                      if (rsp.status == 200) {
                        resolve(true);
                      } else {
                        this.$Message.error(rsp.error.message);
                        reject("更新文档失败！");
                      }
                    })
                    .catch(error => {
                      reject(error);
                    });
                })
              );
            }

            Promise.all(arrSrv)
              .then(r => {
                this.$Message.success("操作成功");
                this.loadTable();
                this.showDialog = false;
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      });
    },

    onCancelDialog() {
      this.showDialog = false;
    }
  }
};
</script>
<style lang="less" scoped>
.btn-right-top {
  text-align: right;
  margin-top: 5px;
  margin-bottom: 15px;
}
.tools-container {
  .ivu-upload {
    display: inline-block;
    .ivu-upload-list {
      margin: 0;
      display: none;
    }
  }
  .ivu-btn {
    margin-right: 5px;
  }
}
</style>