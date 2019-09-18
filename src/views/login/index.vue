<template>
  <div class="login-user">
    <div class="title">
      <h2>
        <img
          style="width:45px;vertical-align:middle"
          src="@/assets/img/logo/logo_sipsd_blue.png"
        />
        一张图综合运维管理系统
      </h2>
    </div>
    <div class="content">
      <Form
        :model="user"
        :rules="rules"
      >
        <FormItem>
          <AutoComplete
            v-model="user.ip"
            :data="ips"
            :filter-method="filterMethod"
            placeholder="格式：192.168.84.117:8003"
            size="large"
          ></AutoComplete>
        </FormItem>
        <FormItem prop="appid">
          <Select
            v-model="user.appid"
            placeholder="请选择Appid"
            @on-open-change="showSelect"
          >
            <Option
              v-for="item in appidList"
              :value="item.appId"
              :key="item.id"
            >{{ item.appId }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="userAccount">
          <Input
            size="large"
            v-model="user.userAccount"
            placeholder="请输入账号"
          />
        </FormItem>
        <FormItem prop="userPwd">
          <Input
            type="password"
            size="large"
            v-model="user.userPwd"
            @on-enter="checkLogin"
            placeholder="请输入密码"
          />
        </FormItem>
      </Form>
      <div class="login-btn">
        <Button
          type="primary"
          long
          style="height:40px,font-size:15px;"
          @click="checkLogin"
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
    return {
      appid: "",
      appidList: [],
      ips: []
    };
  },
  mounted() {
    let autocompleteIPs = localStorage["autocompleteIPs"];
    if (autocompleteIPs) {
      let ipStored = JSON.parse(autocompleteIPs);
      if (ipStored != null && ipStored.length > 0) {
        this.ips = ipStored;
      }
    }
  },
  methods: {
    onChange() {
      this.appidList = [];
      if (this.user.ip) {
        Server.get({
          url: `http://${this.user.ip}/onemapsrv/admin/App/Query/`,
          params: {
            appids: ""
          }
        }).then(rsp => {
          if (rsp) {
            this.appidList = rsp.data.rcds;
          }
        });
      }
    },
    filterMethod(value, option) {
      return option.indexOf(value) !== -1;
    },
    showSelect(value) {
      if (value === true && this.lastIP != this.user.ip) {
        this.lastIP = this.user.ip;
        this.onChange();
      }
    }
  }
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
