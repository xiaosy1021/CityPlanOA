<template>
  <Form :model="form" ref="formValidate" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="名称:" prop="name"><Input v-model="form.name" placeholder="名称" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="标签:" prop="label"><Input v-model="form.label" placeholder="标签" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="服务地址:"><Input v-model="form.url" type="textarea" :rows="4" placeholder="服务地址" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="默认值:" prop="defaultValue"><Input v-model="form.defaultValue" placeholder="默认值" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="备注:" prop="remark"><Input v-model="form.remark" placeholder="备注" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="顺序:" prop="order"><Input v-model="form.order" placeholder="顺序" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="功能:">
        <CheckboxGroup>
          <Checkbox label="是否有效" v-model="form.isEnable"></Checkbox>
          <Checkbox label="是否扩展" v-model="form.isShowChart"></Checkbox>
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
        appID: "",
        label: "",
        url: "",
        name: "",
        defaultValue: "",
        order: "",
        remark: "",
        isEnable: false
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.name = "";
      this.form.label = "";
      this.form.url = "";
      this.form.defaultValue = "";
      this.form.order = "";
      this.form.remark = "";
      this.form.isEnable = false;
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.url = row.url;
      this.form.defaultValue = row.defaultValue;
      this.form.order = row.order;
      this.form.remark = row.remark;
      this.form.isEnable = row.isEnable;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          label: this.form.label,
          url: this.form.url,
          defaultValue: this.form.defaultValue,
          order: this.form.order,
          remark: this.form.remark,
          isEnable: this.form.isEnable,
          appid: this.AppId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.label = this.form.label;
        this.datas.url = this.form.url;
        this.datas.defaultValue = this.form.defaultValue;
        this.datas.order = this.form.order;
        this.datas.remark = this.form.remark;
        this.datas.isEnable = this.form.isEnable;
        return this.datas;
      }
    }
  }
};
</script>