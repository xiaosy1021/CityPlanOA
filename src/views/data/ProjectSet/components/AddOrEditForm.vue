<template>
  <Form ref="frmData" :model="form" :rules="rules" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="项目集:" prop="projectRootNo"><Input v-model="form.projectRootNo" placeholder="项目集" /></FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
  import Server from "@/core/server";
  import {
    services
  } from "@/core/services";
  import {
    routerparams
  } from "@/core/mixins/routerp";
  export default {
    mixins: [routerparams],
    components: {},
    props: {},
    data() {
      return {
        form: {
          id: -1,
          projectRootNo: ""
        },

        rules: {
          projectRootNo: [{
            required: true,
            message: "项目集不能为空",
            trigger: "blur"
          }],
        },
      }
    },
    created() {},
    mounted() {
      this.init();
    },
    watch: {},
    computed: {},
    methods: {
      init() {
      },

      //重置表单
      resetForm() {
        this.isEdit=false;

        this.form.id = -1;
        this.form.projectRootNo = "";

        this.form.projectRootNo =`XZJKQ${new Date().Format("yyyyMMddhhmmss")}`;
      },
      //编辑表单
      editForm(row) {
        this.resetForm();
        this.isEdit=true;

        this.form.id = row.id;
        this.form.projectRootNo = row.projectRootNo;
      },
      getForm() {
        return {
          id: this.form.id,
          projectRootNo: this.form.projectRootNo,
        };

      }
    },
  }
</script>
<style lang="less" scoped>
</style>