<template>
  <Form :model="form" :label-width="80">
    <FormItem label="地图名称:">
      <Input v-model="form.name" placeholder="地图名称" />
    </FormItem>
    <FormItem label="标签:">
      <Input v-model="form.label" placeholder="标签" />
    </FormItem>
    <FormItem label="配置:">
      <Input v-model="form.config" placeholder="配置" />
    </FormItem>
    <FormItem label="资源服务:">
      <Input v-model="form.serviceUrl" placeholder="资源服务" />
    </FormItem>
    <FormItem label="功能:">
      <CheckboxGroup>
        <Checkbox label="追加用户信息" v-model="form.addUserAccount"></Checkbox>
        <Checkbox label="是否展开" v-model="form.isExpand"></Checkbox>
      </CheckboxGroup>
    </FormItem>
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
        name: "",
        label: "",
        serviceUrl: "",
        icon: "",
        config: "",
        order: "",
        addUserAccount: false,
        isExpand: false
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.name = "";
      this.form.label = "";
      this.form.serviceUrl = "";
      this.form.icon = "";
      this.form.config = "";
      this.form.order = "";
      this.form.addUserAccount = false;
      this.form.isExpand = false;
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.serviceUrl = row.serviceUrl;
      this.form.icon = row.icon;
      this.form.config = row.config;
      this.form.order = row.order;
      this.form.addUserAccount = row.addUserAccount;
      this.form.isExpand = row.isExpand;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          label: this.form.label,
          serviceUrl: this.form.serviceUrl,
          icon: this.form.icon,
          config: this.form.config,
          addUserAccount: this.form.addUserAccount,
          isExpand: this.form.isExpand,
          visible: this.form.visible,
          enable: this.form.enable,
          isShowNewSign: this.form.isShowNewSign,
          Appid: this.AppId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.label = this.form.label;
        this.datas.serviceUrl = this.form.serviceUrl;
        this.datas.icon = this.form.icon;
        this.datas.config = this.form.config;
        this.datas.addUserAccount = this.form.addUserAccount;
        this.datas.isExpand = this.form.isExpand;
        this.datas.visible = this.form.visible;
        this.datas.enable = this.form.enable;
        this.datas.isShowNewSign = this.form.isShowNewSign;
        return this.datas;
      }
    }
  }
};
</script>