<template>
  <Form :model="form" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="角色名:" prop="name"><Input v-model="form.name" placeholder="角色名" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="描述:"><Input v-model="form.description" type="textarea" :rows="4" placeholder="描述" /></FormItem>
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
        description: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "角色名不能为空",
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
      this.form.description = "";
    },
    //编辑表单
    editForm(row) {
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.description = row.description;
    },
    //初始化新增
    getForm() {
      return {
        id: this.form.id,
        name: this.form.name,
        description: this.form.description,
        appid: this.AppId
      };
    }
  }
};
</script>