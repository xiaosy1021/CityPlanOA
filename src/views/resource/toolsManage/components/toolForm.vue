   <template>
  <div>
    <Form :model="form" :label-width="80" ref="menu">
      <FormItem label="工具标识:">
        <Input v-model="form.toolKey" placeholder="工具标识" />
      </FormItem>
      <FormItem label="名称:">
        <Input v-model="form.name" placeholder="名称" />
      </FormItem>
      <FormItem label="标签:">
        <Input v-model="form.label" placeholder="标签" />
      </FormItem>
      <FormItem label="图标:">
        <Input v-model="form.icon" placeholder="图标" />
      </FormItem>
      <FormItem label="类型:">
        <Input v-model="form.type" placeholder="类型" />
      </FormItem>
      <FormItem label="顺序:">
        <Input v-model="form.order" placeholder="顺序" />
      </FormItem>
      <FormItem label="事件:">
        <Input v-model="form.clickfun" placeholder="事件" />
      </FormItem>
      <FormItem label="功能:">
        <CheckboxGroup>
          <Checkbox label="可用" v-model="form.enable"></Checkbox>
          <Checkbox label="可见" v-model="form.visible"></Checkbox>
          <Checkbox label="是否扩展子集" v-model="form.isShowNewSign"></Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  props: ["datas", "parentId"],
  mixins: [routerparams],
  data() {
    return {
      form: {
        name: "",
        label: "",
        toolKey: "",
        icon: "",
        type: "",
        clickfun: "",
        order: "",
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
      this.form.name = "";
      this.form.label = "";
      this.form.toolKey = "";
      this.form.icon = "";
      this.form.type = "";
      this.form.order = "";
      this.form.clickfun = "";
      this.form.visible = false;
      this.form.enable = false;
      this.form.isShowNewSign = false;
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.toolKey = row.toolKey;
      this.form.icon = row.icon;
      this.form.type = row.type;
      this.form.order = row.order;
      this.form.clickfun = row.clickfun;
      this.form.visible = row.visible;
      this.form.enable = row.enable;
      this.form.isShowNewSign = row.isShowNewSign;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          label: this.form.label,
          toolKey: this.form.toolKey,
          icon: this.form.icon,
          type: this.form.type,
          order: this.form.order,
          clickfun: this.form.clickfun,
          visible: this.form.visible,
          enable: this.form.enable,
          isShowNewSign: this.form.isShowNewSign,
          Appid: this.AppId,
          pid: this.parentId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.label = this.form.label;
        this.datas.toolKey = this.form.toolKey;
        this.datas.icon = this.form.icon;
        this.datas.type = this.form.type;
        this.datas.order = this.form.order;
        this.datas.clickfun = this.form.clickfun;
        this.datas.visible = this.form.visible;
        this.datas.enable = this.form.enable;
        this.datas.isShowNewSign = this.form.isShowNewSign;
        return this.datas;
      }
    }
  }
};
</script>
    
    