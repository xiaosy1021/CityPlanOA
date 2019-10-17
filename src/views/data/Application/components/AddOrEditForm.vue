<template>
  <Form ref="frmData" :model="form" :rules="rules" :label-width="80">

    <Tabs type="card">
      <TabPane label="申请">
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
          <FormItem label="申请号:" prop="applicationNo"><Input v-model="form.applicationNo" placeholder="申请号"
              :disabled="isEdit" /></FormItem>
          </Col>

          <Col span="12" offset="1">
          <FormItem label="申请类型:">
            <Cascader :data="dataApplicationType" v-model="valueApplicationType"></Cascader>
          </FormItem>
          </Col>

        </Row>

        <Row>
          <Col span="24">
          <FormItem label="申请内容:"><Input type="textarea" :rows="3" v-model="form.content" placeholder="申请内容" />
          </FormItem>
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

      </TabPane>

      <TabPane label="相关书证">

      </TabPane>

      <TabPane label="相关文档">
        <RelatedDocForm :projectId="form.projectId" :projectNo="form.projectNo" :applicationId="form.id"
          :applicationNo="form.applicationNo" v-show="isEdit==true"></RelatedDocForm>
      </TabPane>

    </Tabs>

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
  import {
    treeDicHelper
  } from "@/core/TreeDictionary";
  import RelatedDocForm from "./RelatedDocForm.vue";

  export default {
    mixins: [routerparams],
    components: {
      RelatedDocForm
    },
    data() {
      return {
        allProject: [],
        allCompany: [],

        form: {
          id: -1,
          projectId: -1,
          projectNo: "",
          applicationNo: "",
          applicationTypeCode: "",
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

        isEdit: false,


        //申请类型 级联选择
        dataApplicationType: [],
        valueApplicationType: [],

      };
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.dataApplicationType = CONSTCFG.DataApplicationType;

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
        this.valueApplicationType = [];
        this.isEdit = false;

        this.form.id = -1;
        this.form.projectId = -1;
        this.form.projectNo = "",
          this.form.applicationNo = "";
        this.form.applicationTypeCode = "";
        this.form.content = "";

        this.form.designCompanyId = -1;
        this.form.applicantCompanyId = -1;

      },
      //编辑表单
      editForm(row) {
        this.valueApplicationType = [];
        this.isEdit = true;

        this.form.id = row.id;
        this.form.projectId = row.projectId;
        this.form.projectNo = this.allProject.find(p => p.value == this.form.projectId).projectNo;
        this.form.applicationNo = row.applicationNo;
        this.form.applicationTypeCode = row.applicationTypeCode;
        this.form.content = row.content;

        this.form.designCompanyId = row.designCompany.id;
        this.form.applicantCompanyId = row.applicationCompany.id;


        this.valueApplicationType = treeDicHelper.getArrValueByRSearchTree(row.applicationTypeCode, '322019000');
      },


      getForm() {

        this.form.projectNo = this.allProject.find(p => p.value == this.form.projectId).projectNo;
        this.form.applicationTypeCode = this.valueApplicationType[this.valueApplicationType.length - 1];

        return {
          id: this.form.id,
          projectId: this.form.projectId,
          projectNo: this.form.projectNo,

          applicationNo: this.form.applicationNo,
          content: this.form.content,
          applicationTypeCode: this.form.applicationTypeCode,

          designCompanyId: this.form.designCompanyId,
          applicantCompanyId: this.form.applicantCompanyId,

        };
      },
    }
  };
</script>

<style scoped>

</style>