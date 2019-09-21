<template>
    <Form :model="form" :label-width="80">
        <Row>
            <Col span="11">
            <FormItem label="单位名称:"><Input v-model="form.name" placeholder="单位名称" /></FormItem>
            </Col>
            <Col span="11" offset="2">
            <FormItem label="单位代码:"><Input v-model="form.companyNo" placeholder="单位代码" /></FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
            <FormItem label="地址:"><Input v-model="form.address" placeholder="地址" /></FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="11">
            <FormItem label="联系人:"><Input v-model="form.contactor" placeholder="联系人" /></FormItem>
            </Col>

            <Col span="11" offset="2">
            <FormItem label="联系电话:"><Input v-model="form.phone" placeholder="联系电话" /></FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="11">
            <FormItem label="邮编:"><Input v-model="form.postCode" placeholder="邮编" /></FormItem>
            </Col>
            <Col span="11" offset="2">
            <FormItem label="传真:"><Input v-model="form.fax" placeholder="传真" /></FormItem>
            </Col>
        </Row>
    </Form>
</template>

<script>
    import {
        routerparams
    } from "@/core/mixins/routerp";

    export default {
        mixins: [routerparams],
        data() {
            return {
                form: {
                    id: "",
                    name: "",
                    companyNo: "",
                    contactor: "",
                    address: "",
                    postCode: "",
                    phone: "",
                    fax: ""
                }
            };
        },
        methods: {
            //重置表单
            resetForm() {
                this.form.id = "";
                this.form.name = "";
                this.form.companyNo = "";
                this.form.contactor = "";
                this.form.address = "";
                this.form.postCode = "";
                this.form.phone = "";
                this.form.fax = "";
            },
            //编辑表单
            editForm(row) {
                this.form.id = row.id;
                this.form.name = row.name;
                this.form.companyNo = row.companyNo;
                this.form.contactor = row.contactor;
                this.form.address = row.address;
                this.form.postCode = row.postCode;
                this.form.phone = row.phone;
                this.form.fax = row.fax;
            },

            getForm() {
                return {
                    id: this.form.id,
                    name: this.form.name,
                    companyNo: this.form.companyNo,
                    contactor: this.form.contactor,
                    address: this.form.address,
                    postCode: this.form.postCode,
                    phone: this.form.phone,
                    fax: this.form.fax,
                };
            }
        }
    };
</script>