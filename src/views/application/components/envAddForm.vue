<template>
  <Form :model="form" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="12">
        <FormItem label="应用名称:" prop="label">
          <Input v-model="form.label"/>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="设备:">
          <Input v-model="form.device" placeholder="PC / IOS / Android ..."/>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="责任人:">
          <Input v-model="form.dutyUser"/>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="顺序:">
          <Input v-model="form.order" placeholder="0,1,2..."/>
        </FormItem>
      </Col>
      <Col span="24">
        <FormItem label="二维码地址:">
          <Input
            v-model="form.qr"
            placeholder="http://122.193.33.86:8006/sharefiles/ProjMgrWeb/QR/"
          />
        </FormItem>
      </Col>
      <Col span="24">
        <FormItem label="应用地址:">
          <Input v-model="form.url" placeholder="http://"/>
        </FormItem>
      </Col>
      <Col span="24">
        <FormItem label="视频地址:">
          <Input
            v-model="form.videoUrl"
            placeholder="http://122.193.33.86:8006/sharefiles/ProjMgrWeb/Video/"
          />
        </FormItem>
      </Col>

      <Col span="24">
        <FormItem label="备注:">
          <Input type="textarea" :rows="2" v-model="form.remark"/>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  props: ["datas"],
  data() {
    return {
      form: {
        pid: "",
        label: "",
        device: "",
        dutyUser: "",
        order: 0,
        qr: "",
        url: "",
        videoUrl: "",
        remark: ""
      },
      ruleValidate: {
        label: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    //重置表单
    resetForm(pid) {
      this.form.pid = pid;
      this.form.label = "";
      this.form.device = "";
      this.form.dutyUser = "";
      this.form.order = 0;
      this.form.qr = "http://122.193.33.86:8006/sharefiles/ProjMgrWeb/QR/";
      this.form.url = "";
      this.form.videoUrl =
        "http://122.193.33.86:8006/sharefiles/ProjMgrWeb/Video/";
      this.form.remark = "";
    },
    //编辑表单
    editForm(row) {
      debugger;
      this.form.pid = row.pid;
      this.form.label = row.label;
      this.form.device = row.device;
      this.form.dutyUser = row.dutyUser;
      this.form.order = row.order;
      this.form.qr =
        row.qr === ""
          ? "http://122.193.33.86:8006/sharefiles/ProjMgrWeb/QR/"
          : row.qr;
      this.form.url = row.url;
      this.form.videoUrl =
        row.videoUrl === ""
          ? "http://122.193.33.86:8006/sharefiles/ProjMgrWeb/Video/"
          : row.videoUrl;
      this.form.remark = row.remark;
    },
    //初始化新增
    getForm() {
      debugger;
      if (this.datas === null) {
        return {
          pid: this.form.pid,
          label: this.form.label,
          device: this.form.device,
          dutyUser: this.form.dutyUser,
          order: this.form.order,
          qr: this.form.qr,
          url: this.form.url,
          videoUrl: this.form.videoUrl,
          remark: this.form.remark
        };
      } else {
        this.datas.label = this.form.label;
        this.datas.device = this.form.device;
        this.datas.dutyUser = this.form.dutyUser;
        this.datas.order = this.form.order;
        this.datas.qr = this.form.qr;
        this.datas.url = this.form.url;
        this.datas.videoUrl = this.form.videoUrl;
        this.datas.remark = this.form.remark;

        return this.datas;
      }
    }
  }
};
</script>