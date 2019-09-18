  <template>
  <Form :model="form" :label-width="80">
    <FormItem label="Grid名称:">
      <Input v-model="form.gridName" placeholder="Grid名称" />
    </FormItem>
    <FormItem label="Grid标签:">
      <Input v-model="form.label" placeholder="标签" />
    </FormItem>
    <FormItem label="模板名称:">
      <Input v-model="form.templateName" placeholder="模板名称" />
    </FormItem>
    <FormItem label="顺序:">
      <Input v-model="form.order" placeholder="顺序" />
    </FormItem>
    <FormItem label="二次查询:">
      <Input v-model="form.qurl" placeholder="二次查询" />
    </FormItem>
  </Form>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";

export default {
  props: ["datas"],
  mixins: [routerparams],
  data() {
    return {
      form: {
        gridName: "",
        label: "",
        templateName: "",
        qurl: "",
        order: ""
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.gridName = "";
      this.form.label = "";
      this.form.templateName = "";
      this.form.qurl = "";
      this.form.order = "";
    },
    //编辑表单
    editForm(row) {
      this.form.gridName = row.gridName;
      this.form.label = row.label;
      this.form.templateName = row.templateName;
      this.form.qurl = row.qurl;
      this.form.order = row.order;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          appid: this.AppId,
          gridName: this.form.gridName,
          label: this.form.label,
          templateName: this.form.templateName,
          qurl: this.form.qurl,
          order: this.form.order
        };
      } else {
        this.datas.gridName = this.form.gridName;
        this.datas.label = this.form.label;
        this.datas.templateName = this.form.templateName;
        this.datas.qurl = this.form.qurl;
        this.datas.order = this.form.order;
        return this.datas;
      }
    }
  }
};
</script>