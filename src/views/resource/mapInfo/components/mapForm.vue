  <template>
  <Form :model="form" :label-width="80">
    <FormItem label="地图名称:">
      <Input v-model="form.name" placeholder="地图名称" />
    </FormItem>
    <FormItem label="初始范围:">
      <Input v-model="form.extent" placeholder="初始范围" />
    </FormItem>
    <FormItem label="空间参考系:">
      <Input v-model="form.spatialReference" placeholder="空间参考系" />
    </FormItem>
    <FormItem label="地图Token:">
      <Input v-model="form.tokens" placeholder="地图Token" />
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
        extent: "",
        spatialReference: "",
        tokens: "",
        targetUrl: "",
        icon: ""
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.id = "";
      this.form.name = "";
      this.form.extent = "";
      this.form.spatialReference = "";
      this.form.icon = "";
      this.form.tokens = "";
    },
    //编辑表单
    editForm(row) {
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.extent = row.extent;
      this.form.spatialReference = row.spatialReference;
      this.form.tokens = row.tokens;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          name: this.form.name,
          extent: this.form.extent,
          spatialReference: this.form.spatialReference,
          tokens: this.form.tokens,
          appid: this.AppId
        };
      } else {
        this.datas.name = this.form.name;
        this.datas.label = this.form.label;
        this.datas.extent = this.form.extent;
        this.datas.spatialReference = this.form.spatialReference;
        this.datas.tokens = this.form.tokens;
        return this.datas;
      }
    }
  }
};
</script>