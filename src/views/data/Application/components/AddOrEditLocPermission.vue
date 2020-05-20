<template>
  <div class="certificate-container">
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <Row>
        <Col span="12">
          <FormItem label="证书编号:" prop="certNo">
            <Input v-model="form.certNo" placeholder="证书编号" :disabled="editType=='edit'" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="发证日期:" prop="issuedDate">
            <DatePicker
              format="yyyy-MM-dd"
              v-model="form.issuedDate"
              type="date"
              placeholder="选择日期"
              style="width:100%"
            ></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="建设项目名称:" prop="projectName">
            <!-- <Input v-model="form.projectName" placeholder="建设项目名称" /> -->
            <Select
              v-model="form.projectId"
              :label-in-value="true"
              filterable
              @on-change="projectChanged"
            >
              <Option
                v-for="item in allProject"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="建设单位名称:" prop="applicantCompany">
            <Input v-model="form.applicantCompany" placeholder="建设单位名称" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="建设项目依据:" prop="projectBasis">
            <Input v-model="form.projectBasis" placeholder="建设项目依据" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="建设项目拟选位置:" prop="projectLocation">
            <Input v-model="form.projectLocation" placeholder="建设项目拟选位置" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="拟用地面积:" prop="landAreaString">
            <Input v-model="form.landAreaString" placeholder="拟用地面积" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="拟建设规模:" prop="buildingAreaString">
            <Input v-model="form.buildingAreaString" placeholder="拟建设规模" />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
export default {
  components: {},
  props: {
    certId: {
      type: Number,
      default: -1
    },
    editType: {
      type: String,
      default: "edit"
    }
  },
  watch: {
    certId: function(val) {
      this.getCertById();
    },
    allProject: {
      deep: true,
      handler: function() {}
    }
  },
  data() {
    return {
      allProject: [],
      form: {
        certNo: "",
        issuedDate: "",
        projectId: "",
        projectName: "",
        applicantCompany: "",
        projectBasis: "",
        projectLocation: "",
        landAreaString: "",
        buildingAreaString: ""
      },
      rules: {
        certNo: [
          {
            required: true,
            message: "证书号不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.loadAllProject();
    this.getCertById();
  },
  computed: {},
  methods: {
    async loadAllProject() {
      let rsp = await Server.get({
        url:
          services.data.project +
          `?name=&projectType=&page=0&pageSize=0&GetAll=true`
      });
      if (rsp.success === true) {
        rsp.result.items.forEach(item => {
          item.value = item.id;
          item.label = item.name;
          item.projectNo = item.projectNo;
        });
        this.allProject = rsp.result.items;
      } else {
        this.$Message.error("加载所有项目异常：" + rsp.error.message);
      }
    },
    projectChanged(option) {
      let project = this.allProject.find(p => {
        return p.value == this.form.projectId;
      });
      if (project) {
        this.form.projectName = project.name;
        this.form.applicantCompany = project.constructionCompany.name;
        // this.form.projectBasis=project.
        this.form.projectLocation = project.location;
        this.form.landAreaString = project.landArea;
        // this.form.buildingAreaString=project.
      }
    },
    getCertById() {
      if (this.editType == "edit") {
        Server.get({
          url: services.data.certs + `/` + this.certId
        }).then(rsp => {
          if (rsp.success == true) {
            for (let key in this.form) {
              this.form[key] = rsp.result[key];
            }
          }
        });
      } else {
        this.$refs.form.resetFields();
        this.form.projectId = "";
      }
    },
    async getFormData() {
      let valid = await this.$refs.form.validate();
      if (valid) {
        this.form.issuedDate = this.form.issuedDate
          ? this.form.issuedDate.Format("yyyy-MM-dd")
          : "";
        return this.form;
      }
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