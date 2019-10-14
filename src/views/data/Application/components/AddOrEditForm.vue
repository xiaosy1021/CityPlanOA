<template>
  <Form ref="frmData" :model="form" :rules="rules" :label-width="80">
    <Row>
      <Col span="24">
      <!-- <FormItem label="项目名称:" prop="name"><Input v-model="form.name" placeholder="项目名称" /></FormItem> -->
      <FormItem label="项目名称:">
        <Select v-model="form.projectId" filterable :on-change="projectChanged()">
          <Option v-for="item in allProject" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      </Col>
    </Row>

    <Row>
      <Col span="11">
      <FormItem label="申请号:" prop="applicationNo"><Input v-model="form.applicationNo" placeholder="申请号" /></FormItem>
      </Col>
    </Row>

    <Row>
      <Col span="24">
      <FormItem label="申请内容:"><Input type="textarea" :rows="3" v-model="form.content" placeholder="申请内容" /></FormItem>
      </Col>
    </Row>


    <Collapse simple>
      <Panel name="1">
        申请单位
        <div slot="content">
          <Row>
            <Col span="24">
            <FormItem label="名称:">
              <Select v-model="form.applicantCompanyId" filterable :on-change="applicantCompanyChanged()">
                <Option v-for="item in allCompany" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select></FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="联系人:"><Input v-model="form.applicantCompanyContactor.name" placeholder="联系人" />
            </FormItem>
            </Col>
            <Col span="11" offset="2">
            <FormItem label="联系电话:"><Input v-model="form.applicantCompanyContactor.phone" placeholder="联系电话" />
            </FormItem>
            </Col>
          </Row>
        </div>
      </Panel>
      <Panel name="2">
        设计单位
        <div slot="content">
          <Row>
            <Col span="24">
            <FormItem label="名称:">
              <Select v-model="form.designCompanyId" filterable :on-change="designCompanyChanged()">
                <Option v-for="item in allCompany" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select></FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="联系人:"><Input v-model="form.designCompanyContactor.name" placeholder="联系人" />
            </FormItem>
            </Col>
            <Col span="11" offset="2">
            <FormItem label="联系电话:"><Input v-model="form.designCompanyContactor.phone" placeholder="联系电话" />
            </FormItem>
            </Col>
          </Row>
        </div>
      </Panel>

    </Collapse>

  </Form>
</template>

<script>
  import Server from "@/core/server";
  import {
    services
  } from "@/core/services";
  import {
    CONSTCFG
  } from "@/core/const";
  import {
    routerparams
  } from "@/core/mixins/routerp";

  export default {
    mixins: [routerparams],
    data() {
      return {
        allProject: [],
        allCompany: [],
        form: {
          id: -1,
          projectId: -1,
          applicationNo: "",
          content: "",

          designCompanyId: -1,
          designCompanyContactor: {
            name: "",
            phone: ""
          },
          applicantCompanyId: -1,
          applicantCompanyContactor: {
            name: "",
            phone: ""
          }
        },

        rules: {
          applicationNo: [{
            required: true,
            message: "申请号不能为空",
            trigger: "blur"
          }],
        },

      };
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.loadAllCompany();
        this.loadAllProject();
      },

      loadAllProject() {
        Server.get({
          url: services.data.project +
            `?name=&projectType=&page=0&pageSize=0&GetAll=true`
        }).then(rsp => {
          if (rsp.success === true) {
            for (var i = 0; i < rsp.result.items.length; i++) {
              var item = rsp.result.items[i];
              this.allProject.push({
                value: item.id,
                label: item.name,
                projectNo: item.projectNo
              });
            }
          } else {
            this.$Message.error(rsp.error.message);
          }
        });
      },

      loadAllCompany() {
        Server.get({
          url: services.data.company +
            `?name=&CompanyNo=&page=0&pageSize=0&GetAll=true`
        }).then(rsp => {
          if (rsp.success === true) {
            for (var i = 0; i < rsp.result.items.length; i++) {
              var item = rsp.result.items[i];
              this.allCompany.push({
                value: item.id,
                label: item.name,

                contactor: item.contactor,
                phone: item.phone
              });
            }
          } else {
            this.$Message.error(rsp.error.message);
          }
        });
      },

      projectChanged() {

      },

      applicantCompanyChanged() {
        var company = this.allCompany.find(p => p.value == this.form.applicantCompanyId);
        if (company) {
          this.form.applicantCompanyContactor.name = company.contactor;
          this.form.applicantCompanyContactor.phone = company.phone;
        }
      },

      designCompanyChanged() {
        var company = this.allCompany.find(p => p.value == this.form.designCompanyId);
        if (company) {
          this.form.designCompanyContactor.name = company.contactor;
          this.form.designCompanyContactor.phone = company.phone;
        }
      },

      //重置表单
      resetForm() {
        this.form.id = -1;
        this.form.projectId = -1;
        this.form.applicationNo = "";
        this.form.content = "";

        this.form.designCompanyId = -1;
        this.form.applicantCompanyId = -1;

      },
      //编辑表单
      editForm(row) {
        this.form.id = row.id;
        this.form.projectId = row.projectId;
        this.form.applicationNo = row.applicationNo;
        this.form.content = row.content;

        this.form.designCompanyId = row.designCompany.id;
        this.form.applicantCompanyId = row.applicationCompany.id;

      },

      getForm() {
        debugger;
        var projNo = this.allProject.find(p => p.value == this.form.projectId).projectNo;

        return {
          id: this.form.id,
          projectId: this.form.projectId,
          projectNo: projNo,

          applicationNo: this.form.applicationNo,
          content: this.form.content,
          applicationTypeCode: "未定义",

          designCompanyId: this.form.designCompanyId,
          applicantCompanyId: this.form.applicantCompanyId,

        };

      }
    }
  };
</script>

<style scoped>

</style>