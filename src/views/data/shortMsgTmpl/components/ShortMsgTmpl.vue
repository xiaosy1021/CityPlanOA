<template>
  <Form :model="form" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="模板名:"><Input v-model="form.templateKey" placeholder="模板名" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="模板内容:"><Input v-model="form.msgTemplate" placeholder="模板内容" type="textarea" :rows="4" /></FormItem>
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
        msgTemplate: ""
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.templateKey = "";
      this.form.msgTemplate = "";
    },
    //编辑表单
    editForm(row) {
      this.form.templateKey = row.templateKey;
      this.form.msgTemplate = row.msgTemplate;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          templateKey: this.form.templateKey,
          msgTemplate: this.form.msgTemplate,
          appid: this.AppId
        };
      } else {
        this.datas.templateKey = this.form.templateKey;
        this.datas.msgTemplate = this.form.msgTemplate;
        return this.datas;
      }
    }
  }
};
</script>