<template>
  <Form :model="form" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="12">
      <FormItem label="账号:" prop="userAccount"><Input v-model="form.userAccount" placeholder="账号" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="用户名:" prop="userName"><Input v-model="form.userName" placeholder="用户名" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
      <FormItem label="密码:" prop="passWd"><Input v-model="form.passWd" placeholder="密码" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="性别:">
        <Select clearable v-model="form.sex">
          <Option value="男" :key="0">男</Option>
          <Option value="女" :key="1">女</Option>
        </Select>
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
      <FormItem label="职务:"><Input v-model="form.duty" placeholder="职务" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="单位:"><Input v-model="form.company" placeholder="单位" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="部门:"><Input v-model="form.department" placeholder="部门" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="手机:"><Input v-model="form.phoneNumber" placeholder="手机" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="设备授权:">
        <Checkbox v-model="form.isEnablePC">电脑端</Checkbox>
        <Checkbox v-model="form.isEnableMobile">移动端</Checkbox>
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
        userAccount: "",
        userName: "",
        passWd: "",
        sex: "男",
        duty: "",
        department: "",
        company: "",
        phoneNumber: "",
        isEnablePC: false,
        isEnableMobile: false
      },
      ruleValidate: {
        userAccount: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        userName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        passWd: [
          {
            required: true,
            message: "密码不能为空",
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
      this.form.userAccount = "";
      this.form.userName = "";
      this.form.passWd = "";
      this.form.duty = "";
      this.form.sex = "";
      this.form.department = "";
      this.form.company = "";
      this.form.phoneNumber = "";
      this.form.isEnablePC = false;
      this.form.isEnableMobile = false;
    },
    //编辑表单
    editForm(row) {
      this.form.id = row.id;
      this.form.userAccount = row.userAccount;
      this.form.userName = row.userName;
      this.form.passWd = row.passWd;
      this.form.sex = row.sex;
      this.form.duty = row.duty;
      this.form.department = row.department;
      this.form.phoneNumber = row.phoneNumber;
      this.form.company = row.company;
      this.form.isEnablePC = row.isEnablePC;
      this.form.isEnableMobile = row.isEnableMobile;
    },
    //初始化新增
    getForm() {
      return {
        id: this.form.id,
        userAccount: this.form.userAccount,
        userName: this.form.userName,
        passWd: this.form.passWd,
        sex: this.form.sex,
        duty: this.form.duty,
        department: this.form.department,
        company: this.form.company,
        phoneNumber: this.form.phoneNumber,
        isEnablePC: this.form.isEnablePC,
        isEnableMobile: this.form.isEnableMobile,
        appid: this.AppId
      };
    }
  }
};
</script>