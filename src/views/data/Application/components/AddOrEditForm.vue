<template>
  <div id="addOrEditForm">
    <Form :model="form" :rules="rules" :label-width="80">
      <Tabs type="card" :value="tabCurrent">
        <TabPane label="申请" name="tabMain">
          <Row>
            <Col span="24">
              <FormItem label="项目名称:">
                <Select v-model="form.projectId" filterable :on-change="projectChanged()">
                  <Option
                    v-for="item in allProject"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="11">
              <FormItem label="申请号:" prop="applicationNo">
                <Input v-model="form.applicationNo" placeholder="申请号" :disabled="isEdit" />
              </FormItem>
            </Col>

            <Col span="12" offset="1">
              <FormItem label="申请类型:">
                <Cascader :data="dataApplicationType" v-model="valueApplicationType"></Cascader>
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <FormItem label="申请内容:">
                <Input type="textarea" :rows="3" v-model="form.content" placeholder="申请内容" />
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
                      <Select
                        v-model="form.applicantCompanyId"
                        filterable
                        :on-change="applicantCompanyChanged()"
                      >
                        <Option
                          v-for="item in allCompany"
                          :value="item.value"
                          :key="item.value"
                        >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="11">
                    <FormItem label="联系人:">
                      <Input
                        v-model="form.applicantCompanyContactor.name"
                        placeholder="联系人"
                        disabled
                      />
                    </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                    <FormItem label="联系电话:">
                      <Input
                        v-model="form.applicantCompanyContactor.phone"
                        placeholder="联系电话"
                        disabled
                      />
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
                      <Select
                        v-model="form.designCompanyId"
                        filterable
                        :on-change="designCompanyChanged()"
                      >
                        <Option
                          v-for="item in allCompany"
                          :value="item.value"
                          :key="item.value"
                        >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="11">
                    <FormItem label="联系人:">
                      <Input v-model="form.designCompanyContactor.name" placeholder="联系人" disabled />
                    </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                    <FormItem label="联系电话:">
                      <Input
                        v-model="form.designCompanyContactor.phone"
                        placeholder="联系电话"
                        disabled
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </TabPane>

        <TabPane label="相关书证" name="tabCert" :disabled="!isEdit">
          <RelatedCertForm
            :projectId="form.projectId"
            :projectNo="form.projectNo"
            :applicationId="form.id"
            :applicationNo="form.applicationNo"
          ></RelatedCertForm>
        </TabPane>

        <TabPane label="相关文档" name="tabDoc" :disabled="!isEdit">
          <RelatedDocForm
            :projectId="form.projectId"
            :projectNo="form.projectNo"
            :applicationId="form.id"
            :applicationNo="form.applicationNo"
            v-show="isEdit==true"
          ></RelatedDocForm>
        </TabPane>
      </Tabs>
    </Form>
    <div class="form-action-container">
      <Button @click="handleCancel">取消</Button>
      <Button type="primary" @click="handleSave">保存</Button>
    </div>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { CONSTCFG } from "@/core/const";
import { routerparams } from "@/core/mixins/routerp";
import { treeDicHelper } from "@/core/TreeDictionary";
import RelatedDocForm from "./RelatedDocForm.vue";
import RelatedCertForm from "./RelatedCertForm.vue";
import ModalFooter from "@/components/modal-footer";

export default {
  mixins: [routerparams],
  components: {
    RelatedDocForm,
    RelatedCertForm,
    ModalFooter
  },
  data() {
    return {
      tabCurrent: "tabMain",
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
        applicationNo: [
          {
            required: true,
            message: "申请号不能为空",
            trigger: "blur"
          }
        ]
      },
      isEdit: false,
      //申请类型 级联选择
      dataApplicationType: [],
      valueApplicationType: []
    };
  },
  watch: {
    allProject: {
      deep: true,
      handler: function() {
        let project = this.allProject.find(p => {
          return p.value == this.form.projectId;
        });
        this.form.projectNo = project ? project.projectNo : "";
      }
    }
  },
  mounted() {
    this.init();
    parent.pubsub.subscribe("editForm", currentRow => {
      this.editForm(currentRow);
    });
    parent.pubsub.subscribe("resetForm", () => {
      this.resetForm();
    });
  },
  methods: {
    init() {
      this.dataApplicationType = CONSTCFG.DataApplicationType;
      this.loadAllCompany();
      this.loadAllProject();
    },

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

    async loadAllCompany() {
      let rsp = await Server.get({
        url:
          services.data.company +
          `?name=&CompanyNo=&page=0&pageSize=0&GetAll=true`
      });
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
        this.$Message.error("加载所有单位异常：" + rsp.error.message);
      }
    },

    projectChanged() {},

    applicantCompanyChanged() {
      var company = this.allCompany.find(
        p => p.value == this.form.applicantCompanyId
      );
      if (company) {
        this.form.applicantCompanyContactor.name = company.contactor;
        this.form.applicantCompanyContactor.phone = company.phone;
      }
    },

    designCompanyChanged() {
      var company = this.allCompany.find(
        p => p.value == this.form.designCompanyId
      );
      if (company) {
        this.form.designCompanyContactor.name = company.contactor;
        this.form.designCompanyContactor.phone = company.phone;
      }
    },

    //重置表单
    resetForm() {
      this.tabCurrent = "tabMain";
      this.valueApplicationType = [];
      this.isEdit = false;

      this.form.id = -1;
      this.form.projectId = -1;
      this.form.projectNo = "";
      this.form.applicationNo = "";
      this.form.applicationTypeCode = "";
      this.form.content = "";

      this.form.designCompanyId = -1;
      this.form.designCompanyContactor.name = "";
      this.form.designCompanyContactor.phone = "";

      this.form.applicantCompanyId = -1;
      this.form.applicantCompanyContactor.name = "";
      this.form.applicantCompanyContactor.phone = "";
    },
    //编辑表单
    editForm(row) {
      this.resetForm();
      this.valueApplicationType = [];
      this.form.id = row.id;
      this.form.projectId = row.projectId;
      this.form.applicationNo = row.applicationNo;
      this.form.applicationTypeCode = row.applicationTypeCode;
      this.form.content = row.content;
      this.form.designCompanyId = row.designCompany.id;
      this.form.applicantCompanyId = row.applicationCompany.id;
      this.valueApplicationType = treeDicHelper.getArrValueByRSearchTree(
        row.applicationTypeCode,
        "322019000"
      );
      this.isEdit = true;
    },

    getForm() {
      this.form.projectNo = this.allProject.find(
        p => p.value == this.form.projectId
      ).projectNo;
      this.form.applicationTypeCode = this.valueApplicationType[
        this.valueApplicationType.length - 1
      ];
      return {
        id: this.form.id,
        projectId: this.form.projectId,
        projectNo: this.form.projectNo,

        applicationNo: this.form.applicationNo,
        content: this.form.content,
        applicationTypeCode: this.form.applicationTypeCode,

        designCompanyId: this.form.designCompanyId,
        applicantCompanyId: this.form.applicantCompanyId
      };
    },

    handleCancel() {
      parent.pubsub.publish("closePage");
    },
    handleSave() {
      let form = this.getForm();
      let actionType = this.isEdit ? "putJSON" : "postJSON";
      Server[actionType]({
        url: services.data.application,
        params: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json-patch+json"
        }
      }).then(rsp => {
        parent.pubsub.publish("closePage");
        if (rsp.success === true) {
          this.$Message.success("操作成功");
        } else {
          this.$Message.error(rsp.error.message);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#addOrEditForm {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .ivu-form {
    flex-grow: 1;
    flex-shrink: 1;
  }
  .form-action-container {
    height: 50px;
  }
}
</style>