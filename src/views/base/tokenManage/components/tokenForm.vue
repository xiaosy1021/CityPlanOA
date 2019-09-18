<template>
  <Form :model="form" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="Token名:">
        <Input v-model="form.name" placeholder="Token名"/>
      </FormItem>
      </Col>
      <Col span="24">
      <FormItem label="标签:" prop="label">
        <Input v-model="form.label" placeholder="标签"/>
      </FormItem>
      </Col>
      <Col span="24">
      <FormItem label="服务地址:" prop="url">
        <Input v-model="form.url" placeholder="服务地址"/>
      </FormItem>
      </Col>
      <Col span="24">
      <FormItem label="备注:">
        <Input v-model="form.remark" type="textarea" :rows="4" placeholder="备注"/>
      </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams],
  data() {
    return {
      form: {
        id: "",
        name: "",
        label: "",
        url: "",
        remark: ""
      },
      ruleValidate: {
        label: [
          {
            required: true,
            message: "标签不能为空",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "url地址不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.id = "";
      this.form.name = "";
      this.form.label = "";
      this.form.url = "";
      this.form.remark = "";
    },
    //编辑表单
    editForm(row) {
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.url = row.url;
      this.form.remark = row.remark;
    },
    //初始化新增
    getForm() {
      return {
        id: this.form.id,
        name: this.form.name,
        label: this.form.label,
        url: this.form.url,
        remark: this.form.remark,
        appid: this.AppId
      };
    }
  }
};
</script>