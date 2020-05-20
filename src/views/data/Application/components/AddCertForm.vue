<template>
  <div id="addCertForm">
    <AddOrEditLocPermission
      ref="1110004"
      :certId="certId"
      :editType="editType"
      v-if="certType=='1110004'"
    ></AddOrEditLocPermission>
    <span v-else>暂无相关证书模版</span>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import AddOrEditLocPermission from "./AddOrEditLocPermission";
export default {
  components: { AddOrEditLocPermission },
  props: {
    certId: {
      type: Number,
      default: -1
    },
    certType: {
      type: String,
      default: ""
    },
    editType: {
      type: String,
      default: ""
    },
    projectId: {
      type: Number,
      default: -1
    },
    projectNo: {
      type: String,
      default: ""
    },
    applicationId: {
      type: Number,
      default: -1
    },
    applicationNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    async saveForm() {
      console.log(this.$refs[this.certType]);
      let form =await this.$refs[this.certType].getFormData();
      if (!form) return;
      form.certType = this.certType;
      form.projectId = this.projectId;
      form.projectNo = this.projectNo;
      form.applicationId = this.applicationId;
      form.applicationNo = this.applicationNo;
      let actionType = this.editType == "add" ? "postJSON" : "putJSON";
      if (actionType == "putJSON") {
        form.id = this.certId;
      }
      Server[actionType]({
        url: services.data.certs,
        params: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json-patch+json"
        }
      }).then(rsp => {
        this.$parent.$parent.showCertDialog = false;
        if (rsp.success === true) {
          this.$Message.success("操作成功");
          this.$parent.$parent.loadTable();
        } else {
          this.$Message.error(rsp.error.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.btn-float-right {
  float: right;
  margin-left: 10px;
}
</style>