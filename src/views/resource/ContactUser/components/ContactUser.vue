<template>
  <Form :model="form" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="姓名:" prop="userName"><Input v-model="form.userName" placeholder="姓名" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="邮箱:" prop="email"><Input v-model="form.email" placeholder="邮箱" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="电话:" prop="phone"><Input v-model="form.phone" placeholder="电话" /></FormItem>
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
        userName: "",
        phone: "",
        email: ""
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.userName = "";
      this.form.email = "";
      this.form.phone = "";
    },
    //编辑表单
    editForm(row) {
      this.form.userName = row.userName;
      this.form.email = row.email;
      this.form.phone = row.phone;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          userName: this.form.userName,
          email: this.form.email,
          phone: this.form.phone,
          appid: this.AppId
        };
      } else {
        this.datas.userName = this.form.userName;
        this.datas.email = this.form.email;
        this.datas.phone = this.form.phone;
        return this.datas;
      }
    }
  }
};
</script>