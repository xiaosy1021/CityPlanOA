<template>
  <div>
    <Form :model="form" :label-width="80">
      <FormItem label="名称:">
        <Input v-model="form.name" placeholder="名称" />
      </FormItem>
      <FormItem label="标签:">
        <Input v-model="form.lable" placeholder="标签" />
      </FormItem>
      <FormItem label="urlPrefix:">
        <Input v-model="form.urlPrefix" placeholder="urlPrefix" />
      </FormItem>
    </Form>
  </div>
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
        lable: "",
        urlPrefix: ""
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.name = "";
      this.form.lable = "";
      this.form.urlPrefix = "";
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.lable = row.lable;
      this.form.urlPrefix = row.urlPrefix;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          lable: this.form.lable,
          urlPrefix: this.form.urlPrefix,
          appid: this.AppId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.lable = this.form.lable;
        this.datas.urlPrefix = this.form.urlPrefix;
        return this.datas;
      }
    }
  }
};
</script>
    
    