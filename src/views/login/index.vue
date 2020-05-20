<template>
  <div class="login-user">
    <div class="title">
      <h2>
        <img style="width:45px;vertical-align:middle" src="@/assets/img/logo/logo_sipsd_blue.png" />
        徐州经济技术开发区规划办文系统
      </h2>
    </div>
    <div class="content">
      <Form ref="frmLogin" :model="user" :rules="rules">
        <FormItem prop="userAccount">
          <Input size="large" v-model="user.userAccount" placeholder="请输入账号" />
        </FormItem>
        <FormItem prop="userPwd">
          <Input
            type="password"
            size="large"
            v-model="user.userPwd"
            @on-enter="checkLogin('frmLogin')"
            placeholder="请输入密码"
          />
        </FormItem>
      </Form>
      <div class="login-btn">
        <Button
          type="primary"
          long
          style="height:40px,font-size:15px;"
          @click="checkLogin('frmLogin')"
        >登 录</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "./js/login";
import Server from "@/core/server";
export default {
  mixins: [login],
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style >
html {
  height: 100%;
  background: #f3f3f3;
}
#app {
  background: #f3f3f3;
}
.content {
  background: #ffffff;
  padding: 30px;
  width: 350px;
  margin: 0 auto;
}
.login-user {
  position: relative;
  left: 0;
  top: 0;
  padding: 140px 0;
  min-height: 100%;
  /* width: 345px; */
  margin: 0 auto;
  box-sizing: border-box;
}
.title {
  text-align: center;
  padding-bottom: 20px;
}
.title h2 {
  margin-bottom: 10px;
  font-weight: 300;
  font-size: 30px;
  color: #000;
}
.checkbox {
  margin-top: 15px;
}
.login-btn {
  margin-top: -5px;
}
</style>
