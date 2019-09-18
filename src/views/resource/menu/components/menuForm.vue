<template>
  <Form :model="form" :label-width="70">
    <Row>
      <Col span="24">
      <FormItem label="名称:"><Input v-model="form.name" placeholder="名称" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="标签:"><Input v-model="form.label" placeholder="标签" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="链接:"><Input v-model="form.targetUrl" placeholder="链接" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="样式:">
        <Select clearable style="width:100%" v-model="form.viewStyle">
          <Option value="float" label="float"><span>float</span></Option>
          <Option value="dockLeft" label="dockLeft"><span>dockLeft</span></Option>
          <Option value="blank" label="blank"><span>blank</span></Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="目标类型:">
        <Select clearable style="width:100%" v-model="form.targetType">
          <Option value="event" label="event"><span>event</span></Option>
          <Option value="link" label="link"><span>link</span></Option>
          <Option value="server" label="server"><span>server</span></Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="顺序:"><Input v-model="form.order" placeholder="顺序" /></FormItem>
      </Col>
      <Col span="12">
      <FormItem label="图标:"><Input v-model="form.icon" placeholder="图标" /></FormItem>
      </Col>
      <Col span="24">
      <FormItem label="功能:">
        <CheckboxGroup>
          <Checkbox label="初始菜单" v-model="form.initMenu"></Checkbox>
          <Checkbox label="可见" v-model="form.visible"></Checkbox>
          <Checkbox label="可用" v-model="form.enable"></Checkbox>
          <Checkbox label="显示为新数据" v-model="form.isShowNewSign"></Checkbox>
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
  props: ["parentId"],
  data() {
    return {
      form: {
        id: "",
        name: "",
        label: "",
        targetUrl: "",
        icon: "",
        viewStyle: "",
        targetType: "",
        order: "",
        initMenu: false,
        visible: false,
        enable: false,
        isShowNewSign: false
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.id = "";
      this.form.name = "";
      this.form.label = "";
      this.form.targetUrl = "";
      this.form.icon = "";
      this.form.viewStyle = "";
      this.form.targetType = "";
      this.form.order = "";
      this.form.initMenu = false;
      this.form.visible = false;
      this.form.enable = false;
      this.form.isShowNewSign = false;
    },
    //编辑表单
    editForm(row) {
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.targetUrl = row.targetUrl;
      this.form.icon = row.icon;
      this.form.viewStyle = row.viewStyle;
      this.form.targetType = row.targetType;
      this.form.order = row.order;
      this.form.initMenu = row.initMenu;
      this.form.visible = row.visible;
      this.form.enable = row.enable;
      this.form.isShowNewSign = row.isShowNewSign;
    },
    //初始化新增
    getForm() {
      return {
        id: this.form.id,
        name: this.form.name,
        label: this.form.label,
        targetUrl: this.form.targetUrl,
        icon: this.form.icon,
        viewStyle: this.form.viewStyle,
        targetType: this.form.targetType,
        order: this.form.order,
        initMenu: this.form.initMenu,
        visible: this.form.visible,
        enable: this.form.enable,
        isShowNewSign: this.form.isShowNewSign,
        Appid: this.AppId,
        pid: this.parentId
      };
    }
  }
};
</script>