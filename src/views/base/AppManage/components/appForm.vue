<template>
  <Form :model="form" :rules="ruleValidate" :label-width="80">
    <FormItem label="Appid:" prop="Appid">
      <Input v-model="form.Appid" placeholder="Appid" />
    </FormItem>
    <FormItem label="标签:">
      <Input v-model="form.label" placeholder="标签" />
    </FormItem>
    <FormItem label="连接字符串:">
      <Input v-model="form.connectionString" placeholder="连接字符串" />
    </FormItem>
    <FormItem label="库类型:">
      <Select clearable v-model="form.databaseType" size="large">
        <Option value="MSSQL" :key="0">MSSQL</Option>
        <Option value="ORACLE" :key="1">ORACLE</Option>
      </Select>
    </FormItem>
    <FormItem label="srid:">
      <Input v-model="form.srid" placeholder="srid" />
    </FormItem>
    <FormItem label="用户信息:">
      <Input v-model="form.userName" placeholder="用户信息" />
    </FormItem>
    <FormItem label="启用短信:">
      <Col span="11">
      <Checkbox v-model="form.isEnableSMS">电脑端</Checkbox>
      <Checkbox v-model="form.isEnableSMS_mt">移动端</Checkbox>
      </Col>
    </FormItem>
  </Form>
</template>

<script>
export default {
  props: ["datas"],
  data() {
    return {
      form: {
        Appid: "",
        label: "",
        connectionString: "",
        databaseType: "",
        srid: "0",
        userName: "",
        serviceIP: "",
        isEnableSMS: false,
        isEnableSMS_mt: false
      },
      ruleValidate: {
        Appid: [
          {
            required: true,
            message: "Appid不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.urlPrefix = "";
      this.form.Appid = "";
      this.form.label = "";
      this.form.connectionString = "";
      this.form.databaseType = "";
      this.form.srid = "";
      this.form.userName = "";
      this.form.serviceIP = "";
      this.form.isEnableSMS = false;
      this.form.isEnableSMS_mt = false;
    },
    //编辑表单
    editForm(row) {
      this.form.Appid = row.appId;
      this.form.label = row.label;
      this.form.connectionString = row.connectionString;
      this.form.databaseType = row.databaseType;
      this.form.srid = row.srid;
      this.form.userName = row.userName;
      this.form.serviceIP = row.serviceIP;
      this.form.isEnableSMS = row.isEnableSMS;
      this.form.isEnableSMS_mt = row.isEnableSMS_mt;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          Appid: this.form.Appid,
          label: this.form.label,
          connectionString: this.form.connectionString,
          databaseType: this.form.databaseType,
          srid: this.form.srid,
          userName: this.form.userName,
          serviceIP: this.form.serviceIP,
          isEnableSMS: this.form.isEnableSMS,
          isEnableSMS_mt: this.form.isEnableSMS_mt
        };
      } else {
        this.datas.Appid = this.form.Appid;
        this.datas.label = this.form.label;
        this.datas.connectionString = this.form.connectionString;
        this.datas.databaseType = this.form.databaseType;
        this.datas.srid = this.form.srid;
        this.datas.userName = this.form.userName;
        this.datas.serviceIP = this.form.serviceIP;
        this.datas.isEnableSMS = this.form.isEnableSMS;
        this.datas.isEnableSMS_mt = this.form.isEnableSMS_mt;
        return this.datas;
      }
    }
  }
};
</script>