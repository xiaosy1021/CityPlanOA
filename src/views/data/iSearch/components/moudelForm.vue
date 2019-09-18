<template>
  <Form :model="form" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="模板:"><Input v-model="form.templateName" placeholder="模板" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <FormItem label="表名:"><Input v-model="form.tableName" placeholder="表名" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
      <FormItem label="关键字:" prop="keyId"><Input v-model="form.keyId" placeholder="关键字" /></FormItem>
      </Col>
      <Col span="11" offset="2">
      <FormItem label="名称:"><Input v-model="form.keyName" placeholder="名称" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="11">
      <FormItem label="类别:">
        <Input v-model="form.categoryName" placeholder="类别" />
      </FormItem>
      </Col>
      <Col span="11" offset="2">
      <FormItem label="图形:">
        <Select clearable style="width:100%" v-model="form.geoType">
          <Option value="点" label="点">
            <span>点</span>
          </Option>
          <Option value="线" label="线">
            <span>线</span>
          </Option>
          <Option value="面" label="面">
            <span>面</span>
          </Option>
        </Select>
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <FormItem label="其他数据源:"><Input v-model="form.dataAppid" placeholder="其他数据源" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <FormItem label="urlAddress:"><Input type="textarea" :rows="3" v-model="form.urlAddress" placeholder="urlAddress" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <FormItem label="更多:">
        <Checkbox label="显示图形要素" v-model="form.shape">显示图形要素</Checkbox>
      </FormItem>
      </Col>
    </Row>
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
        keyId: "",
        tableName: "",
        templateName: "",
        keyName: "",
        categoryName: "",
        geoType: "",
        urlAddress: "",
        shape: true,
        dataAppid: ""
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.id = "";
      this.form.keyId = "";
      this.form.tableName = "";
      this.form.templateName = "";
      this.form.keyName = "";
      this.form.categoryName = "";
      this.form.geoType = "";
      this.form.keyName = "";
      this.form.urlAddress = "";
      this.form.shape = false;
      this.form.dataAppid = "";
    },
    //编辑表单
    editForm(row) {
      this.form.id = row.id;
      this.form.keyId = row.keyId;
      this.form.tableName = row.tableName;
      this.form.templateName = row.templateName;
      this.form.keyName = row.keyName;
      this.form.categoryName = row.categoryName;
      this.form.geoType = row.geoType;
      this.form.keyName = row.keyName;
      this.form.urlAddress = row.urlAddress;
      this.form.shape = row.shape;
      this.form.dataAppid = row.dataAppid;
    },
    //初始化新增
    getForm() {
      return {
        id: this.form.id,
        keyId: this.form.keyId,
        tableName: this.form.tableName,
        templateName: this.form.templateName,
        keyName: this.form.keyName,
        categoryName: this.form.categoryName,
        geoType: this.form.geoType,
        department: this.form.department,
        keyName: this.form.keyName,
        urlAddress: this.form.urlAddress,
        shape: this.form.shape,
        dataAppid: this.form.dataAppid,
        appid: this.AppId
      };
    }
  }
};
</script>