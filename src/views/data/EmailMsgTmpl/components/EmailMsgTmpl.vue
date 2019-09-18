<template>
  <Form :model="form" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="模板名:" prop="TemplateKey"><Input v-model="form.templateKey" :disabled="form.isSysTmpl" placeholder="模板名" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="邮件主题:" prop="subjectTemplate"><Input v-model="form.subjectTemplate" placeholder="邮件主题" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="邮件内容:"><Input v-model="form.bodyTemplate" type="textarea" :rows="4" placeholder="邮件内容" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="功能:">
        <CheckboxGroup>
          <Checkbox label="系统模板" v-model="form.isSysTmpl"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams],
  props: ["datas"],
  data() {
    return {
      form: {
        templateKey: "",
        subjectTemplate: "",
        bodyTemplate: "",
        isSysTmpl: false
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.templateKey = "";
      this.form.subjectTemplate = "";
      this.form.bodyTemplate = "";
      this.form.isSysTmpl = false;
    },
    //编辑表单
    editForm(row) {
      this.form.templateKey = row.templateKey;
      this.form.subjectTemplate = row.subjectTemplate;
      this.form.bodyTemplate = row.bodyTemplate;
      this.form.isSysTmpl = row.isSysTmpl;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          templateKey: this.form.templateKey,
          subjectTemplate: this.form.subjectTemplate,
          bodyTemplate: this.form.bodyTemplate,
          isSysTmpl: this.form.isSysTmpl,
          appid: this.AppId
        };
      } else {
        this.datas.templateKey = this.form.templateKey;
        this.datas.subjectTemplate = this.form.subjectTemplate;
        this.datas.bodyTemplate = this.form.bodyTemplate;
        this.datas.isSysTmpl = this.form.isSysTmpl;
        return this.datas;
      }
    }
  }
};
</script>