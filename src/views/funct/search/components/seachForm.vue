<template>
  <div>
    <Form :model="form" :rules="ruleValidate" :label-width="70">
      <Row>
        <Col span="24">
        <FormItem label="名称:">
          <Input v-model="form.name" placeholder="名称" />
        </FormItem>
        </Col>
        <Col span="24">
        <FormItem label="标签:">
          <Input v-model="form.label" placeholder="标签" />
        </FormItem>
        </Col>
        <Col span="24">
        <FormItem label="服务:">
          <Input v-model="form.serviceUrl" placeholder="服务" />
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem prop="fgroup" label="分组:"> <Input clearable v-model="form.fgroup" placeholder="分组" /></FormItem>
        </Col>
        <Col span="12">
        <FormItem label="目标类型:">
          <Select clearable style="width:100%" v-model="form.targetType">
            <Option value="event" label="event">
              <span>event</span>
            </Option>
            <Option value="link" label="link">
              <span>link</span>
            </Option>
            <Option value="server" label="server">
              <span>server</span>
            </Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="顺序:">
          <Input v-model="form.order" placeholder="顺序" />
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="功能:">
          <Checkbox label="可见" v-model="form.visable">可见</Checkbox>
        </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  props: ["datas", "group"],
  mixins: [routerparams],
  data() {
    return {
      form: {
        name: "",
        label: "",
        serviceUrl: "",
        targetType: "",
        order: "",
        fgroup: "",
        visable: false
      },
      ruleValidate: {
        fgroup: [
          {
            required: true,
            message: "分组不能为空",
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
      this.form.name = "";
      this.form.label = "";
      this.form.serviceUrl = "";
      this.form.targetType = "";
      this.form.fgroup = this.group;
      this.form.order = "";
      this.form.visable = false;
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.serviceUrl = row.serviceUrl;
      this.form.fgroup = row.fgroup;
      this.form.icon = row.icon;
      this.form.targetType = row.targetType;
      this.form.order = row.order;
      this.form.visable = row.visable;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          label: this.form.label,
          serviceUrl: this.form.serviceUrl,
          fgroup: this.form.fgroup,
          targetType: this.form.targetType,
          order: this.form.order,
          visable: this.form.visable,
          Appid: this.AppId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.label = this.form.label;
        this.datas.serviceUrl = this.form.serviceUrl;
        this.datas.fgroup = this.form.fgroup;
        this.datas.targetType = this.form.targetType;
        this.datas.order = this.form.order;
        this.datas.visable = this.form.visable;
        return this.datas;
      }
    }
  }
};
</script>