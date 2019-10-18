<template>

        <Form ref="frmData" :model="form" :rules="rules" :label-width="80">
            <Row>
                <Col span="11">
                <FormItem label="文档名:" prop="fileName"><Input v-model="form.fileName" placeholder="文档名" />
                </FormItem>
                </Col>
                <Col span="12" offset="1">
                <FormItem label="文档类型:">
                    <Cascader :data="dataDocType" v-model="valueDocType"></Cascader>
                </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="24">
                <FormItem label="备注:"><Input type="textarea" :rows="2" v-model="form.remark" placeholder="备注" />
                </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="24">
                <FormItem label="文档:">
                    <Upload :action="actionUrl" :before-upload="handleUpload">
                        <Button icon="ios-cloud-upload" style="color: #3399ff">选择文档</Button>
                    </Upload>
                    <div v-if="form.file !== null">{{ form.file.name }}</div>
                </FormItem>
                </Col>
            </Row>

        </Form>

</template>

<script>
    import {
        services
    } from "@/core/services";
    import {
        CONSTCFG
    } from "@/core/const";
    import {
        treeDicHelper
    } from "@/core/TreeDictionary";

    export default {
        components: {},
        props: {},
        data() {
            return {
                actionUrl: "",

                //文档类型 级联选择
                dataDocType: [],
                valueDocType: [],

                form: {
                    id: -1,
                    projectId: -1,
                    projectNo: "",
                    applicationId: -1,
                    applicationNo: "",

                    fileName: "",
                    remark: "",
                    docTypeCode: "",
                    docSubTypeCode: "",
                    file: null,
                },

                rules: {
                    fileName: [{
                        required: true,
                        message: "文档名不能为空",
                        trigger: "blur"
                    }],
                },

            }
        },
        created() {},
        mounted() {
            this.init();
        },
        watch: {},
        computed: {},
        methods: {
            init() {
                this.actionUrl = services.data.documents;

                this.dataDocType = CONSTCFG.DataDocType;
            },
            handleUpload(file) {
                this.form.file = file;
                this.form.fileName = file.name;
                return false;
            },

            //重置表单
            resetForm(projectId, projectNo, applicationId, applicationNo) {
                this.valueDocType = [];

                this.form.id = -1;
                this.form.projectId = projectId;
                this.form.projectNo = projectNo;
                this.form.applicationId = applicationId;
                this.form.applicationNo = applicationNo;

                this.form.fileName = "";
                this.form.remark = "";
                this.form.docTypeCode = "";
                this.form.docSubTypeCode = "";
                this.form.file = null;

            },
            //编辑表单
            editForm(row) {
                this.valueDocType = [];

                this.form.id = row.id;
                this.form.projectId = row.projectId;
                this.form.projectNo = row.projectNo;
                this.form.applicationId = row.applicationId;
                this.form.applicationNo = row.applicationNo;

                this.form.fileName = row.fileName;
                this.form.remark = row.remark;
                this.form.docTypeCode = row.docTypeCode;
                this.form.docSubTypeCode = row.docSubTypeCode;
                this.form.file = null;

                this.valueDocType = treeDicHelper.getArrValueByRSearchTree(row.docSubTypeCode, '4010000-0');
            },
            getForm() {
                var rst = {
                    id: this.form.id,
                    projectId: this.form.projectId,
                    projectNo: this.form.projectNo,
                    applicationId: this.form.applicationId,
                    applicationNo: this.form.applicationNo,

                    fileName: this.form.fileName,
                    remark: this.form.remark,

                    docTypeCode: this.valueDocType.length > 1 ? this.valueDocType[this.valueDocType.length - 2] : "",
                    docSubTypeCode: this.valueDocType.length > 0 ? this.valueDocType[this.valueDocType.length - 1] : "",
                    file: this.form.file
                };

                return rst;
            },
        },
    }
</script>
<style lang="less" scoped>
</style>