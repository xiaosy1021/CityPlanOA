<template>
  <Form :model="form" :rules="ruleValidate" :label-width="70">
    <Row>
      <Col span="12">
      <FormItem label="名称:"><Input v-model="form.name" placeholder="名称" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="标签:"><Input v-model="form.label" placeholder="标签" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="InitType:">
        <Select clearable style="width:100%" v-model="form.initType">
          <Option value="column" label="column">
            <span>column</span>
          </Option>
          <Option value="pie" label="pie">
            <span>pie</span>
          </Option>
          <Option value="line" label="line">
            <span>line</span>
          </Option>
          <Option value="spline" label="spline">
            <span>spline</span>
          </Option>
          <Option value="area" label="area">
            <span>area</span>
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="风格:">
        <Select clearable style="width:100%" v-model="form.showStyle">
          <Option value="table" label="table">
            <span>table</span>
          </Option>
          <Option value="11" label="11">
            <span>11</span>
          </Option>
          <Option value="22" label="22">
            <span>22</span>
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem prop="fgroup" label="分组:"> <Input clearable v-model="form.fgroup" placeholder="分组" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="排序:"><Input v-model="form.order" placeholder="排序" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="高度:"> <Input v-model="form.height" placeholder="高度" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="宽度:"> <Input v-model="form.width" placeholder="宽度" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="服务:"> <Input v-model="form.serviceUrl" placeholder="服务" /></FormItem>
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
      <FormItem label="功能:">
        <CheckboxGroup>
          <Checkbox label="显示表数据" v-model="form.isShowGridData"></Checkbox>
          <Checkbox label="显示图表" v-model="form.isShowChart"></Checkbox>
          <Checkbox label="移动端" v-model="form.isMobileAvailable"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams],
  props: ["datas", "group"],
  data() {
    return {
      form: {
        name: "",
        label: "",
        showStyle: "",
        serviceUrl: "",
        initType: "",
        targetType: "",
        order: "",
        height: "",
        width: "",
        fgroup: "",
        isShowGridData: false,
        isShowChart: false,
        isMobileAvailable: false
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
      this.form.showStyle = "";
      this.form.serviceUrl = "";
      this.form.initType = "";
      this.form.targetType = "";
      this.form.order = "";
      this.form.height = "";
      this.form.width = "";
      this.form.fgroup = this.group;
      this.form.isMobileAvailable = false;
      this.form.isShowGridData = false;
      this.form.isShowChart = false;
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.showStyle = row.showStyle;
      this.form.label = row.label;
      this.form.serviceUrl = row.serviceUrl;
      this.form.fgroup = row.fgroup;
      this.form.targetType = row.targetType;
      this.form.isMobileAvailable = row.isMobileAvailable;
      this.form.isShowChart = row.isShowChart;
      this.form.initType = row.initType;
      this.form.targetType = row.targetType;
      this.form.isShowGridData = row.isShowGridData;
      this.form.width = row.width;
      this.form.order = row.order;
      this.form.height = row.height;
    },

    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          label: this.form.label,
          showStyle: this.form.showStyle,
          serviceUrl: this.form.serviceUrl,
          fgroup: this.form.fgroup,
          targetType: this.form.targetType,
          isMobileAvailable: this.form.isMobileAvailable,
          isShowGridData: this.form.isShowGridData,
          isShowChart: this.form.isShowChart,
          initType: this.form.initType,
          width: this.form.width,
          height: this.form.height,
          order: this.form.order,
          Appid: this.AppId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.showStyle = this.form.showStyle;
        this.datas.label = this.form.label;
        this.datas.serviceUrl = this.form.serviceUrl;
        this.datas.fgroup = this.form.fgroup;
        this.datas.targetType = this.form.targetType;
        this.datas.order = this.form.order;
        this.datas.isShowChart = this.form.isShowChart;
        this.datas.isMobileAvailable = this.form.isMobileAvailable;
        this.datas.initType = this.form.initType;
        this.datas.width = this.form.width;
        this.datas.height = this.form.height;
        return this.datas;
      }
    }
  }
};
</script>