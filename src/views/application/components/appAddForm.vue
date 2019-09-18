<template>
  <Tabs size="small" value="name1">
    <TabPane label="基本信息" name="name1">
      <Form :model="form" :label-width="80" :rules="ruleValidate">
        <Row>
          <Col span="16">
            <FormItem label="项目名称:">
              <Input v-model="form.projName"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="AppId:" prop="appid">
              <Input v-model="form.appid" placeholder="AppId"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="账户:">
              <Input v-model="form.testAccount" placeholder="测试账户"/>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="密码:">
              <Input v-model="form.testPsw" placeholder="测试密码"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="责任人:">
              <Input v-model="form.dutyUser" placeholder="需求、开发、运维等相关人员"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="Logo地址:">
              <Input
                type="text"
                v-model="form.logo"
                placeholder="http://122.193.33.86:8006/sharefiles/ProjMgrWeb/Logo/"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="关键字:">
              <Input v-model="form.keyNames" placeholder="中/英文逗号分隔"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注:">
              <Input type="textarea" :rows="2" v-model="form.remark"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </TabPane>
    <TabPane label="项目详细信息" name="name2">
      <Form :model="form" :label-width="90">
        <Row>
          <Col span="12">
            <FormItem label="合同号:">
              <Input v-model="form.contractNo" placeholder="合同号"/>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="省、市、区:">
              <Input style="width:80px;" v-model="form.province" placeholder="江苏省"/>
              <span>-</span>
              <Input style="width:80px;" v-model="form.city" placeholder="苏州市"/>
              <span>-</span>
              <Input style="width:80px;" v-model="form.district" placeholder="工业园区"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="甲方/委托方:">
              <Input v-model="form.owner"/>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="合同签订日期:">
              <DatePicker
                type="date"
                placeholder="选择时间"
                format="yyyy-MM-dd"
                v-model="form.contractDate"
                style="width:100%;"
              ></DatePicker>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="合同金额:">
              <InputNumber
                :min="0"
                v-model="form.contractAmount"
                :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                :parser="value => value.replace(/¥s?|(,*)/g, '')"
              ></InputNumber>
              <span style="margin-left:5px;">万元</span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="已付款比例:">
              <InputNumber
                :min="0"
                :max="100"
                v-model="form.payPercent"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              ></InputNumber>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="预算提交日期:">
              <DatePicker
                type="date"
                placeholder="选择时间"
                format="yyyy-MM-dd"
                v-model="form.projBudgetDate"
                style="width:100%;"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="项目周期:">
              <DatePicker
                type="daterange"
                placeholder="选择时间"
                format="yyyy-MM-dd"
                v-model="form.projDatePeriod"
                style="width:100%;"
              ></DatePicker>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="项目阶段:">
              <Input v-model="form.projStep"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="项目进度:">
              <InputNumber
                :min="0"
                :max="100"
                v-model="form.projProgressPercent"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              ></InputNumber>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="项目经理:">
              <Input v-model="form.projManager"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="PMO进度:">
              <Input v-model="form.pmoStep"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="项目进度描述:">
              <Input type="textarea" :rows="2" v-model="form.projProgressDetail"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="下一步工作:">
              <Input type="textarea" :rows="2" v-model="form.projNextStep"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="项目备注:">
              <Input type="textarea" :rows="2" v-model="form.projRemark"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </TabPane>
  </Tabs>
</template>

<script>
export default {
  props: ["datas"],
  data() {
    return {
      form: {
        appId: "",
        projName: "",
        dutyUser: "",
        testAccount: "",
        testPsw: "",
        remark: "",
        keyNames: "",

        logo: "",
        province: "",
        city: "",
        district: "",
        owner: "",
        contractNo: "",
        contractAmount: 0,
        payPercent: 0,
        contractDate: "",

        projDatePeriod: [],

        projBudgetDate: "",
        projStep: "",
        projManager: "",
        projProgressDetail: "",
        projProgressPercent: 0,
        projNextStep: "",
        pmoStep: "",
        projRemark: ""
      },
      ruleValidate: {
        appId: [
          {
            required: true,
            message: "Appid不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm() {
      this.form.appid = "";
      this.form.projName = "";
      this.form.dutyUser = "";
      this.form.testAccount = "";
      this.form.testPsw = "";
      this.form.remark = "";
      this.form.keyNames = "";

      this.form.logo = "http://122.193.33.86:8006/sharefiles/ProjMgrWeb/Logo/";
      this.form.province = "";
      this.form.city = "";
      this.form.district = "";
      this.form.owner = "";
      this.form.contractNo = "";
      this.form.contractAmount = 0;
      this.form.payPercent = 0;
      this.form.contractDate = "";

      this.form.projDatePeriod = [];

      this.form.projBudgetDate = "";
      this.form.projStep = "";
      this.form.projManager = "";
      this.form.projProgressDetail = "";
      this.form.projProgressPercent = 0;
      this.form.projNextStep = "";
      this.form.pmoStep = "";
      this.form.projRemark = "";
    },
    //编辑表单
    editForm(row) {
      debugger;
      this.form.appid = row.appId;
      this.form.projName = row.projName;
      this.form.dutyUser = row.dutyUser;
      this.form.testAccount = row.testAccount;
      this.form.testPsw = row.testPsw;
      this.form.remark = row.remark;
      var key_names = "";
      for (var i = 0; i < row.keyNames.length; i++) {
        key_names += "," + row.keyNames[i];
      }
      key_names = key_names.substr(1, key_names.length - 1);
      this.form.keyNames = key_names;

      this.form.logo =
        row.logo === ""
          ? "http://122.193.33.86:8006/sharefiles/ProjMgrWeb/Logo/"
          : row.logo;
      this.form.province = row.province;
      this.form.city = row.city;
      this.form.district = row.district;
      this.form.owner = row.owner;
      this.form.contractNo = row.contractNo;
      this.form.contractAmount = row.contractAmount;
      this.form.payPercent = row.payPercent;
      this.form.contractDate = row.contractDate;

      debugger;
      this.form.projDatePeriod = [];
      this.form.projDatePeriod.push(new Date(row.projStartDate));
      this.form.projDatePeriod.push(new Date(row.projEndDate));

      this.form.projBudgetDate = row.projBudgetDate;
      this.form.projStep = row.projStep;
      this.form.projManager = row.projManager;
      this.form.projProgressDetail = row.projProgressDetail;
      this.form.projProgressPercent = row.projProgressPercent;
      this.form.projNextStep = row.projNextStep;
      this.form.pmoStep = row.pmoStep;
      this.form.projRemark = row.projRemark;
    },
    //保存
    getForm() {
      debugger;
      if (this.datas === null) {
        return {
          appid: this.form.appid,
          projName: this.form.projName,
          dutyUser: this.form.dutyUser,
          testAccount: this.form.testAccount,
          testPsw: this.form.testPsw,
          remark: this.form.remark,
          keyNames: this.form.keyNames,

          logo: this.form.logo,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district,
          owner: this.form.owner,
          contractNo: this.form.contractNo,
          contractAmount: this.form.contractAmount,
          payPercent: this.form.payPercent,
          contractDate: this.form.contractDate,

          projStartDate:
            this.form.projDatePeriod.length === 2 &&
            this.form.projDatePeriod[0] instanceof Date &&
            !isNaN(this.form.projDatePeriod[0].getTime()) &&
            this.form.projDatePeriod[0] !== ""
              ? this.form.projDatePeriod[0].Format("yyyy-MM-dd")
              : null,
          projEndDate:
            this.form.projDatePeriod.length === 2 &&
            this.form.projDatePeriod[1] instanceof Date &&
            !isNaN(this.form.projDatePeriod[1].getTime()) &&
            this.form.projDatePeriod[1] !== ""
              ? this.form.projDatePeriod[1].Format("yyyy-MM-dd")
              : null,

          projBudgetDate: this.form.projBudgetDate,
          projStep: this.form.projStep,
          projManager: this.form.projManager,
          projProgressDetail: this.form.projProgressDetail,
          projProgressPercent: this.form.projProgressPercent,
          projNextStep: this.form.projNextStep,
          pmoStep: this.form.pmoStep,
          projRemark: this.form.projRemark
        };
      } else {
        this.datas.appid = this.form.appid;
        this.datas.projName = this.form.projName;
        this.datas.dutyUser = this.form.dutyUser;
        this.datas.testAccount = this.form.testAccount;
        this.datas.testPsw = this.form.testPsw;
        this.datas.remark = this.form.remark;
        this.datas.keyNames = this.form.keyNames;

        this.datas.logo = this.form.logo;
        this.datas.province = this.form.province;
        this.datas.city = this.form.city;
        this.datas.district = this.form.district;
        this.datas.owner = this.form.owner;
        this.datas.contractNo = this.form.contractNo;
        this.datas.contractAmount = this.form.contractAmount;
        this.datas.payPercent = this.form.payPercent;
        this.datas.contractDate = this.form.contractDate;

        debugger;
        this.datas.projStartDate =
          this.form.projDatePeriod.length === 2 &&
          this.form.projDatePeriod[0] instanceof Date &&
          !isNaN(this.form.projDatePeriod[0].getTime()) &&
          this.form.projDatePeriod[0] !== ""
            ? this.form.projDatePeriod[0].Format("yyyy-MM-dd")
            : null;
        this.datas.projEndDate =
          this.form.projDatePeriod.length === 2 &&
          this.form.projDatePeriod[1] instanceof Date &&
          !isNaN(this.form.projDatePeriod[1].getTime()) &&
          this.form.projDatePeriod[1] !== ""
            ? this.form.projDatePeriod[1].Format("yyyy-MM-dd")
            : null;

        this.datas.projBudgetDate = this.form.projBudgetDate;
        this.datas.projStep = this.form.projStep;
        this.datas.projManager = this.form.projManager;
        this.datas.projProgressDetail = this.form.projProgressDetail;
        this.datas.projProgressPercent = this.form.projProgressPercent;
        this.datas.projNextStep = this.form.projNextStep;
        this.datas.pmoStep = this.form.pmoStep;
        this.datas.projRemark = this.form.projRemark;

        return this.datas;
      }
    }
  }
};
</script>