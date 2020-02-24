<template>

    <Form ref="frmData" :model="form" :rules="rules" :label-width="80">
        <Row>
            <Col span="11">
            <FormItem label="书证号:" prop="certNo"><Input v-model="form.certNo" placeholder="书证号" />
            </FormItem>
            </Col>
            <Col span="12" offset="1">
            <FormItem label="书证类型:">
                <Cascader :data="dataCertType" v-model="valueCertType"></Cascader>
            </FormItem>
            </Col>
        </Row>

        <Row>
            <Col span="11">
            <FormItem label="发证日期:">
                <DatePicker v-model="form.issuedDate" type="date" placeholder="选择日期" style="width: 218px"></DatePicker>
            </FormItem>
            </Col>

            <div class="btn-float-right">
                <Button type="dashed" title="制证">
                    <Icon type="ios-filing" size="18" />
                </Button>
            </div>

            <div class="btn-float-right">
                <Upload :action="actionUrl" :before-upload="handleUpload">
                    <Button icon="ios-cloud-upload" style="color: #3399ff">上传书证</Button>
                </Upload>
            </div>

            <div class="btn-float-right">
                <Button type="dashed" title="模板下载">
                    <Icon type="md-download" size="18" />
                </Button>
            </div>

            <div v-if="file !== null">{{file.name}}</div>

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
                file: null,

                //书证类型 级联选择
                dataCertType: [],
                valueCertType: [],

                form: {
                    id: -1,
                    projectId: -1,
                    projectNo: "",
                    applicationId: -1,
                    applicationNo: "",

                    certNo: "",
                    issuedDate: new Date(),
                },

                rules: {
                    certNo: [{
                        required: true,
                        message: "书证号不能为空",
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
                this.actionUrl = services.data.certs;
                this.dataCertType = CONSTCFG.DataCertType;
            },

            handleUpload(file) {
                this.file = file;
                return false;
            },

            //重置表单
            resetForm(projectId, projectNo, applicationId, applicationNo) {
                this.valueCertType = [];

                this.form.id = -1;
                this.form.projectId = projectId;
                this.form.projectNo = projectNo;
                this.form.applicationId = applicationId;
                this.form.applicationNo = applicationNo;

                this.form.certNo = "";
                this.form.issuedDate = new Date();
            },
            //编辑表单
            editForm(row) {
                this.valueCertType = [];

                this.form.id = row.id;
                this.form.projectId = row.projectId;
                this.form.projectNo = row.projectNo;
                this.form.applicationId = row.applicationId;
                this.form.applicationNo = row.applicationNo;

                this.form.certNo = row.certNo;
                this.form.issuedDate = row.issuedDate;

                this.valueCertType = row.valueCertType;
            },
            getForm() {

                var certType = this.valueCertType.length > 0 ? this.valueCertType[this.valueCertType.length - 1] : "";
                var rst = {
                    id: this.form.id,
                    projectId: this.form.projectId,
                    projectNo: this.form.projectNo,
                    applicationId: this.form.applicationId,
                    applicationNo: this.form.applicationNo,

                    certNo: this.form.certNo,
                    certType: certType,

                    issuedDate: new Date(this.form.issuedDate).Format("yyyy-MM-dd hh:mm:ss"),

                    // discriminator: 'testA',
                };
                debugger;

                return rst;
            },
        },
    }
</script>
<style lang="less" scoped>

.btn-float-right{
    float:right;
    margin-left:10px;
}
</style>