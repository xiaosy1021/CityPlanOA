<template>
  <Form :model="form" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="字典键:" prop="codeKey"><Input v-model="form.codeKey" placeholder="字典键"/></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="字典值:" prop="codeValue"><Input v-model="form.codeValue" placeholder="字典值"/></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="类型:" prop="category">
        <Select clearable style="width:100%" v-model="form.category">
          <Option value="联系人分组" label="联系人分组"><span>联系人分组</span></Option>
          <Option value="地图分组" label="地图分组"><span>地图分组</span></Option>
        </Select>
      </FormItem>
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
        codeKey: "",
        codeValue: "",
        category: ""
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.codeKey = "";
      this.form.codeValue = "";
      this.form.category = "";
    },
    //编辑表单
    editForm(row) {
      this.form.codeKey = row.codeKey;
      this.form.codeValue = row.codeValue;
      this.form.category = row.category;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          appId: this.AppId,
          codeKey: this.form.codeKey,
          codeValue: this.form.codeValue,
          category: this.form.category
        };
      } else {
        this.datas.codeKey = this.form.codeKey;
        this.datas.codeValue = this.form.codeValue;
        this.datas.category = this.form.category;
        return this.datas;
      }
    }
  }
};
</script>