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
        <template slot-scope="{ row }" slot="issuedDate">
          <span>{{new Date(row.issuedDate).Format("yyyy-MM-dd")}}</span>
        </template>
        <template slot-scope="{ row,index}" slot="certTempl">
          <div class="tools-container">
            <Button shape="circle" icon="ios-paper" title="生成模板" @click="handleCreateTempl(row)"></Button>
            <Upload
              :data="tt"
              :action="uploadAction+'/'+row.id+'/doc'"
              :show-upload-list="false"
              :format="['doc','docx']"
              :before-upload="(file)=>{handleBeforeUpload(file,row)}"
              :on-success="handleUploadSuccess"
              :on-format-error="handleFormatError"
              :headers="headers"
            >
              <Button shape="circle" icon="ios-cloud-upload" title="文件上传"></Button>
            </Upload>
            <Button
              shape="circle"
              icon="ios-cloud-download"
              title="文件下载"
              @click="handleDownload(row)"
            ></Button>
            <Button shape="circle" icon="ios-print" title="文件打印" @click="handlePrint(row)"></Button>
          </div>
        </template>
      </Table>
    </div>

    <Modal v-model="showDialog" :mask-closable="false" width="400" title="选择书证类型">
      <Cascader :data="dataCertType" v-model="valueCertType"></Cascader>
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
    </Modal>

    <Modal v-model="showCertDialog" :mask-closable="false" width="800" title="选择书证类型">
      <AddCertForm
        ref="addCertForm"
        :certId="certId"
        :certType="certType"
        :editType="editType"
        :projectId="projectId"
        :projectNo="projectNo"
        :applicationId="applicationId"
        :applicationNo="applicationNo"
      ></AddCertForm>
      <modal-footer slot="footer" @on-save="onSaveCert" @on-cancel="onCancelCertDialog" />
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
import AddCertForm from "./AddCertForm.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    ModalFooter,
    AddCertForm
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
  computed: {
    ...mapGetters("oidcStore", ["oidcAccessToken"]),
    headers: function() {
      return {
        authorization: "Bearer " + this.oidcAccessToken
      };
    }
  },
  data() {
    return {
      tt: {
        id: 19
      },
      showDialog: false,
      showCertDialog: false,
      isLoading: false,
      //书证类型 级联选择
      dataCertType: [],
      valueCertType: [],
      table: {
        columns: [
          {
            title: "序号",
            type: "index",
            width: 60,
            align: "center"
          },

          {
            title: "证书号",
            key: "certNo",
            width: 150,
            sortable: true,
            align: "center"
          },
          {
            title: "证书类型",
            key: "txtCertType",
            width: 230,
            sortable: true,
            align: "center"
          },
          {
            title: "发证日期",
            key: "issuedDate",
            width: 250,
            sortable: true,
            align: "center",
            slot: "issuedDate"
          },
          {
            title: "操作",
            key: "action",
            width: 120,
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
            title: "书证操作",
            key: "action",
            width: 200,
            align: "center",
            slot: "certTempl",
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
      editType: "edit",
      certId: -1,
      certType: "",
      uploadAction: `${services.data.certs}`
    };
  },
  created() {},
  mounted() {
    this.init();
    this.initUploadEvent();
  },
  watch: {
    applicationId() {
      if (this.applicationId > 0) {
        this.loadTable();
      }
    }
  },
  methods: {
    init() {
      this.dataCertType = CONSTCFG.DataCertType;
    },
    initUploadEvent() {},

    loadTable() {
      this.isLoading = true;
      Server.get({
        url: services.data.application + `/` + this.applicationId + `/certs`
      })
        .then(rsp => {
          this.isLoading = false;
          if (rsp.success === true) {
            let data = [];
            rsp.result.forEach(item => {
              item.valueCertType = treeDicHelper.getArrValueByRSearchTree(
                item.certType,
                "1110000-0"
              );
              item.txtCertType = treeDicHelper.getDisplayByRSearchTree(
                item.certType,
                "1110000-0"
              );
              data.push(item);
            });
            this.table.data = data;
          } else {
            this.$Message.error("加载申请相关书证异常：" + rsp.error.message);
          }
        })
        .catch(err => {
          this.$Message.error("加载申请相关书证异常：" + err.message);
        });
    },

    onAdd() {
      this.showDialog = true;
    },
    onEdit(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.editType = "edit";
        this.certType = currentRow.certType;
        this.certId = currentRow.id;
        this.showCertDialog = true;
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
              url: services.data.certs + "/" + currentRow.id
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

    handleCreateTempl(currentRow) {
      if (!currentRow) {
        this.$Message.warning("请选择需要下载的书证");
      } else {
        Server.getDownloadFile({
          url: services.data.certs + "/" + currentRow.id + "/templ",
          fileName: currentRow.certNo
        });
      }
    },
    onSave() {
      if (this.valueCertType.length == 0) {
        this.$Message.warning({
          content: "请选择证书类型！"
        });
        return;
      }
      this.showDialog = false;
      this.showCertDialog = true;
      this.certType = this.valueCertType[0];
      this.editType = "add";
      this.certId = new Number(-1);
    },
    onCancelDialog() {
      this.showDialog = false;
    },
    onSaveCert() {
      this.$refs.addCertForm.saveForm();
    },
    onCancelCertDialog() {
      this.showCertDialog = false;
    },
    handleBeforeUpload(file, row) {
      Server.postFormData({
        url: services.data.certs + "/to-pdf",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          file: file
        }
      }).then(rsp => {
        if (rsp.data != "") {
          Server.postFormData({
            url: services.data.certs + "/" + row.id + "/pdf",
            headers: {
              "Content-Type": "multipart/form-data"
            },
            params: {
              file: rsp.data
            }
          });
          var url = window.URL.createObjectURL(rsp.data);
          this.layerIndex = layer.open({
            type: 2,
            title: "新增/编辑 申请",
            content: url,
            area: ["80%", "80%"],
            maxmin: true,
          });
        }
      });
    },
    handleUploadSuccess(response, file, fileList) {
      this.$Message.success({
        content: "文件上传成功！"
      });
    },
    handleFormatError(file, fileList) {
      this.$Message.warning({
        content: "请选择doc、docx文件！"
      });
    },
    handleDownload(currentRow) {
      Server.getDownloadFile({
        url: services.data.certs + "/" + currentRow.id + "/doc",
        fileName: currentRow.certNo
      });
      Server.getDownloadFile({
        url: services.data.certs + "/" + currentRow.id + "/pdf",
        fileName: currentRow.certNo
      });
    },
    handlePrint(currentRow) {
      Server.getDownloadFile({
        url: services.data.certs + "/" + currentRow.id + "/pdf",
        callback: rsp => {
          var url = window.URL.createObjectURL(rsp.data);
          this.layerIndex = layer.open({
            type: 2,
            title: "新增/编辑 申请",
            content: url,
            area: ["80%", "80%"],
            maxmin: true,
          });
        }
      });
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