<template>
    <div>
        <div class="btn-right-top">
            <Button type="primary" @click="onAdd()">新增</Button>
        </div>

        <div class="main-table-section">
            <Table :loading="isLoading" border max-height="280" :columns="table.columns" :data="table.data">
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
    import {
        services
    } from "@/core/services";
    import {
        CONSTCFG
    } from "@/core/const";
    import {
        renderHelper
    } from "@/core/common";
    import {
        treeDicHelper
    } from "@/core/TreeDictionary";

    import ModalFooter from "@/components/modal-footer";
    import UploadDocForm from "./UploadDocForm.vue";

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
                    columns: [{
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
                            fixed: 'right'
                        },
                        {
                            title: "下载",
                            key: "action",
                            width: 100,
                            align: "center",
                            render: (h, params) => {
                                return renderHelper.renderDownloadButtonForTable(
                                    h,
                                    params,
                                    this.onDownload
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
            this.init();
        },
        watch: {
            applicationId() {
                this.table.data = [];
                if (this.applicationId > 0) {
                    this.loadRelatedDoc();
                }

            }
        },
        computed: {},
        methods: {
            init() {
                this.dataDocType = CONSTCFG.DataDocType;
            },

            loadRelatedDoc() {
                this.isLoading = true;

                Server.get({
                    url: services.data.application + `/` + this.applicationId + `/documents`
                }).then(rsp => {
                    this.isLoading = false;
                    if (rsp.success === true) {
                        this.table.data = [];
                        for (var i = 0; i < rsp.result.length; i++) {
                            var item = rsp.result[i];

                            var valueDocType = treeDicHelper.getArrValueByRSearchTree(item.docSubTypeCode,
                                '4010000-0');
                            var txtDocType = treeDicHelper.getDisplayByRSearchTree(item.docSubTypeCode,
                                '4010000-0');

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
                this.$refs.frmAddOrEditDoc.resetForm(this.projectId, this.projectNo, this.applicationId, this
                    .applicationNo);
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
                                    this.loadRelatedDoc();
                                } else {
                                    this.$Message.error(rsp.message);
                                }
                            });
                        },
                        onCancel: () => {}
                    });
                }
            },

            onDownload(currentRow, index) {
                if (!currentRow) {
                    this.$Message.warning("请选择需要下载的文档");
                } else {
                    Server.getDownloadFile({
                        url: services.data.documents + "/" + currentRow.id + "/download",
                        fileName: currentRow.fileName
                    })
                }
            },

            onSave() {
                this.$refs.frmAddOrEditDoc.$refs['frmData'].validate((valid) => {
                    debugger;
                    if (valid) {
                        let form = this.$refs.frmAddOrEditDoc.getForm();

                        if (!form.Id || form.Id < 0) {
                            if (form.File == null) {
                                this.$Message.error("请选择上传文档！");
                            }

                            Server.postFormData({
                                url: services.data.documents,
                                // params: JSON.stringify(form),
                                params: form,
                                headers: {
                                    'Content-Type': "multipart/form-data; boundary=----WebKitFormBoundaryA9c9Q76jJjZPGe6M"
                                }
                            }).then(rsp => {
                                if (rsp.success === true) {
                                    this.$Message.success("操作成功");
                                    this.loadRelatedDoc();
                                    this.showDialog = false;
                                } else {
                                    this.$Message.error(rsp.error.message);
                                }
                            });
                        }
                        // else {
                        //   Server.putJSON({
                        //     url: services.data.application,
                        //     params: JSON.stringify(form),
                        //     headers: {
                        //       'Content-Type': "application/json-patch+json"
                        //     }
                        //   }).then(rsp => {
                        //     if (rsp.success === true) {
                        //       this.$Message.success("操作成功");
                        //       this.onRefresh();
                        //       this.showDialog = false;
                        //     } else {
                        //       this.$Message.error(rsp.error.message);
                        //     }
                        //   });
                        // }
                    }
                })

            },

            onCancelDialog() {
                this.showDialog = false;
            }
        },
    }
</script>
<style lang="less" scoped>
    .btn-right-top {
        text-align: right;
        margin-top: 5px;
        margin-bottom: 15px;
    }
</style>