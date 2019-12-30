<template>
  <Form ref="frmData" :model="form" :rules="rules" :label-width="80">
    <Row>
      <Col span="12">
      <FormItem label="项目名称:" prop="name"><Input v-model="form.name" placeholder="项目名称" /></FormItem>
      </Col>

      <Col span="11" offset="1">
      <FormItem label="项目号:"  prop="projectNo"><Input v-model="form.projectNo" placeholder="项目号" :disabled="isEdit" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <FormItem label="项目位置:" prop="location"><Input v-model="form.location" placeholder="项目位置" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
      <FormItem label="项目类型:">
        <Cascader :data="dataProjType" v-model="valueProjType"></Cascader>
      </FormItem>
      </Col>

      <Col span="11" offset="1">
      <FormItem label="项目集:">
        <Select v-model="form.projectRootId" filterable :on-change="projectSetChanged()">
          <Option v-for="item in allProjectSet" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      </Col>
    </Row>

    <Row>
      <Col span="12">
      <FormItem label="用地性质:">
        <Cascader :data="dataLandusage" v-model="valueLandusage"></Cascader>
      </FormItem>
      </Col>

      <Col span="11" offset="1">
      <FormItem label="用地面积:"><Input v-model="form.landArea" placeholder="用地面积" /></FormItem>
      </Col>
    </Row>

    <Row>
      <Col span="24">
      <FormItem label="项目内容:" prop="content"><Input v-model="form.content" placeholder="项目内容" /></FormItem>
      </Col>
    </Row>


    <Collapse simple>
      <Panel name="1">
        建设单位
        <div slot="content">
          <Row>
            <Col span="24">
            <FormItem label="名称:" >
              <Select v-model="form.constructionCompanyId" filterable :on-change="constructionCompanyChanged()">
                <Option v-for="item in allCompany" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select></FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="联系人:"><Input v-model="form.constructionCompanyContactor.name" placeholder="联系人"  disabled/>
            </FormItem>
            </Col>
            <Col span="11" offset="2">
            <FormItem label="联系电话:"><Input v-model="form.constructionCompanyContactor.phone" placeholder="联系电话"  disabled/>
            </FormItem>
            </Col>
          </Row>
        </div>
      </Panel>
      <Panel name="2">
        产权单位
        <div slot="content">
          <Row>
            <Col span="24">
            <FormItem label="名称:" >
              <Select v-model="form.ownerCompanyId" filterable :on-change="ownerCompanyChanged()">
                <Option v-for="item in allCompany" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="联系人:"><Input v-model="form.ownerCompanyContactor.name" placeholder="联系人"  disabled/>
            </FormItem>
            </Col>
            <Col span="11" offset="2">
            <FormItem label="联系电话:"><Input v-model="form.ownerCompanyContactor.phone" placeholder="联系电话"  disabled/>
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
        allCompany: [],
        allProjectSet: [],
        form: {
          id: -1,
          name: "",
          projectNo: "",
          projectRootId: "",
          projectRootNo: "",
          location: "",
          content: "",

          landusageCode: "",
          landusage: "",
          landArea: 0,
          projectTypeCode: "",
          projectSubTypeCode: "",
          ownerCompanyId: -1,
          ownerCompanyContactor: {
            name: "",
            phone: ""
          },
          constructionCompanyId: -1,
          constructionCompanyContactor: {
            name: "",
            phone: ""
          }
        },

        rules: {
          name: [{
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }],

          projectNo: [{
            required: true,
            message: "项目号不能为空",
            trigger: "blur"
          }],

          location: [{
            required: true,
            message: "项目位置不能为空",
            trigger: "blur"
          }],

          content: [{
            required: true,
            message: "项目内容不能为空",
            trigger: "blur"
          }],

        },


        //项目类型 级联选择
        dataProjType: [],
        valueProjType: [],

        //用地性质 级联选择
        dataLandusage: [],
        valueLandusage: [],

        isEdit: false,
      };
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.dataProjType = CONSTCFG.DataProjType;
        this.dataLandusage = CONSTCFG.DataLandusage;

        this.loadAllCompany();
        this.loadAllProjectSet();
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

      loadAllProjectSet() {
        Server.get({
          url: services.data.projectset +
            `?page=0&pageSize=0&GetAll=true`
        }).then(rsp => {
          if (rsp.success === true) {
            for (var i = 0; i < rsp.result.items.length; i++) {
              var item = rsp.result.items[i];
              this.allProjectSet.push({
                value: item.id,
                label: item.projectRootNo,
              });
            }
          } else {
            this.$Message.error(rsp.error.message);
          }
        });
      },

      projectSetChanged() {
        var prjSet = this.allProjectSet.find(p => p.value == this.form.projectRootId);
        if (prjSet) {
          this.form.projectRootNo = prjSet.label;
        }
      },

      constructionCompanyChanged() {
        var company = this.allCompany.find(p => p.value == this.form.constructionCompanyId);
        if (company) {
          this.form.constructionCompanyContactor.name = company.contactor;
          this.form.constructionCompanyContactor.phone = company.phone;
        }
      },

      ownerCompanyChanged() {
        var company = this.allCompany.find(p => p.value == this.form.ownerCompanyId);
        if (company) {
          this.form.ownerCompanyContactor.name = company.contactor;
          this.form.ownerCompanyContactor.phone = company.phone;
        }
      },

      //重置表单
      resetForm() {
        this.isEdit = false;

        this.form.id = -1;
        this.form.name = "";
        this.form.projectNo = "";
        this.form.projectRootId = "";
        this.form.projectRootNo = "";
        this.form.location = "";
        this.form.content = "";

        this.form.landusageCode = "";
        this.form.landusage = "";
        this.form.landArea = 0;
        this.form.projectTypeCode = "";
        this.form.projectSubTypeCode = "";

        this.form.ownerCompanyId = -1;
        this.form.ownerCompanyContactor.name= "";
        this.form.ownerCompanyContactor.phone= "";

        this.form.constructionCompanyId = -1;
        this.form.constructionCompanyContactor.name= "";
        this.form.constructionCompanyContactor.phone= "";

        this.valueProjType = [];
        this.valueLandusage = [];
      },
      //编辑表单
      editForm(row) {
        this.resetForm();
        this.isEdit = true;

        this.form.id = row.id;
        this.form.name = row.name;
        this.form.projectNo = row.projectNo;
        this.form.projectRootId = row.projectRootId;
        this.form.projectRootNo = row.projectRootNo;
        this.form.location = row.location;
        this.form.content = row.content;

        this.form.landusageCode = row.landusageCode;
        this.form.landusage = row.landusage;
        this.form.landArea = row.landArea;
        this.form.projectTypeCode = row.projectTypeCode;
        this.form.projectSubTypeCode = row.projectSubTypeCode;
        this.form.ownerCompanyId = row.ownerCompanyId;
        this.form.constructionCompanyId = row.constructionCompanyId;

        this.valueProjType = [];
        this.valueProjType.push(this.form.projectTypeCode);
        this.valueProjType.push(this.form.projectSubTypeCode);
        this.valueLandusage = [];
        this.valueLandusage.push(this.form.landusageCode.substring(0,1));
        this.valueLandusage.push(this.form.landusageCode);
      },

      getForm() {
        if (this.valueProjType.length > 1) {
          this.form.projectTypeCode = this.valueProjType[0];
          this.form.projectSubTypeCode = this.valueProjType[1];
        }
        if (this.valueLandusage.length > 1) {
          this.form.landusageCode = this.valueLandusage[1];
          this.form.landusage = this.dataLandusage.find(p => p.value == this.valueLandusage[0]).children.find(p => p.value == this.valueLandusage[1]).label;
        }

        return {
          id: this.form.id,
          name: this.form.name,
          projectNo: this.form.projectNo,
          projectRootId: this.form.projectRootId,
          projectRootNo: this.form.projectRootNo,
          location: this.form.location,
          content: this.form.content,

          projectTypeCode: this.form.projectTypeCode,
          projectSubTypeCode: this.form.projectSubTypeCode,
          ownerCompanyId: this.form.ownerCompanyId,
          constructionCompanyId: this.form.constructionCompanyId,
          landusageCode: this.form.landusageCode,
          landusage: this.form.landusage,
          landArea: this.form.landArea,
        };

      }
    }
  };
</script>

<style scoped>

</style>