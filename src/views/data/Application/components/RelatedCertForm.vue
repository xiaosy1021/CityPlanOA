<template>
    <div>
        <div class="btn-right-top">
            <Button type="primary" @click="onAdd()">新增</Button>
        </div>

        <div class="main-table-section">
            <Table :loading="isLoading" border max-height="280" :columns="table.columns" :data="table.data">
            </Table>
        </div>


        <Modal v-model="showDialog" :mask-closable="false" width="680" title="新增/编辑 书证">
            <AddCertForm ref="frmAddOrEditCert" />
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
    import AddCertForm from "./AddCertForm.vue";

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
        data() {
            return {
                showDialog: false,
                isLoading: false,

                //书证类型 级联选择
                dataCertType: [],

                table: {
                    columns: [{
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
                if (this.applicationId > 0) {
                    this.loadTable();
                }
            }
        },
        computed: {},
        methods: {
            init() {
                this.dataCertType = CONSTCFG.DataCertType;
            },

            loadTable() {
                this.isLoading = true;

                Server.get({
                    url: services.data.application + `/` + this.applicationId + `/certs`
                }).then(rsp => {
                    this.isLoading = false;
                    debugger;
                    if (rsp.success === true) {
                        this.table.data = [];
                        for (var i = 0; i < rsp.result.length; i++) {
                            var item = rsp.result[i];

                            var valueCertType = treeDicHelper.getArrValueByRSearchTree(item.certType,
                                '1110000-0');
                            var txtCertType = treeDicHelper.getDisplayByRSearchTree(item.certType,
                                '1110000-0');


                            this.table.data.push({
                                id: item.id,
                                projectId: item.projectId,
                                projectNo: item.projectNo,
                                applicationId: item.applicationId,
                                applicationNo: item.applicationNo,
                                certNo: item.certNo,
                                issuedDate: new Date(item.issuedDate).Format("yyyy-MM-dd"),


                                txtCertType: txtCertType,
                                valueCertType: valueCertType
                            });
                        }
                    } else {
                        this.$Message.error("加载申请相关书证异常："+rsp.error.message);
                    }
                }).catch(err => {
                    this.$Message.error("加载申请相关书证异常："+err.message);

                });
            },

            onAdd() {
                this.showDialog = true;
                this.$refs.frmAddOrEditCert.resetForm(this.projectId, this.projectNo, this.applicationId, this
                    .applicationNo);
            },
            onEdit(currentRow, index) {
                if (!currentRow) {
                    this.$Message.warning("请选择需要操作的行");
                } else {
                    this.$refs.frmAddOrEditCert.editForm(currentRow);
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

            onDownload(currentRow, index) {
                if (!currentRow) {
                    this.$Message.warning("请选择需要下载的书证");
                } else {
                    Server.getDownloadFile({
                        url: services.data.certs + "/" + currentRow.id + "/pdf",
                        fileName: currentRow.fileName
                    })
                }
            },

            onSave() {
                this.$refs.frmAddOrEditCert.$refs['frmData'].validate((valid) => {
                    if (valid) {
                        let form = this.$refs.frmAddOrEditCert.getForm();
                        debugger;

                        if (!form.id || form.id < 0) {

                            Server.postJSON({
                                url: services.data.certs,
                                // params: JSON.stringify(form),
                                params: form,
                                headers: {
                                    'Content-Type': "application/json-patch+json"
                                }
                            }).then(rsp => {
                                if (rsp.success === true) {
                                    this.$Message.success("操作成功");
                                    this.loadTable();
                                    this.showDialog = false;
                                } else {
                                    this.$Message.error(rsp.error.message);
                                }
                            });
                        } else {
                            Server.putJSON({
                                url: services.data.certs,
                                params: form,
                                headers: {
                                    'Content-Type': "application/json-patch+json"
                                }
                            }).then(rsp => {
                                if (rsp.success === true) {
                                    this.$Message.success("操作成功");
                                    this.loadTable();
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