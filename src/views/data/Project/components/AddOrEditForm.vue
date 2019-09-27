<template>
  <Form ref="frmData" :model="form" :rules="rules" :label-width="80">
    <Row>
      <Col span="24">
      <FormItem label="项目名称:" prop="name"><Input v-model="form.name" placeholder="项目名称" /></FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <FormItem label="项目位置:"><Input v-model="form.location" placeholder="项目位置" /></FormItem>
      </Col>
    </Row>
    <Row>
      <!-- <Col span="11">
      <FormItem label="所属项目集:"><Input placeholder="所属项目集" /></FormItem>
      </Col> -->

      <Col span="11">
      <FormItem label="项目类型：">
        <Cascader :data="dataProjType" v-model="valueProjType"></Cascader>
      </FormItem>
      </Col>

      <Col span="11" offset="2">
      <FormItem label="项目号:"><Input v-model="form.projectNo" placeholder="项目号" /></FormItem>
      </Col>
    </Row>

    <Row>
      <Col span="24">
      <FormItem label="项目内容:"><Input v-model="form.content" placeholder="项目内容" /></FormItem>
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
    data() {
      return {
        form: {
          id: -1,
          name: "",
          projectNo: "",
          location: "",
          content: "",

          landusageCode: "R2",
          landusage: "R2 二类居住用地",
          landArea: 98,
          projectTypeCode: "",
          projectSubTypeCode: "",
          ownerCompanyId: 9,
          constructionCompanyId: 9
        },
        rules: {
          name: [{
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }],
        },

        //字典表
        dataDictionary: [],

        //项目类型 级联选择
        dataProjType: [],
        valueProjType: [],

        //用地性质 级联选择
        dataLandusage: [],
        valueLandusage: []
      };
    },
    mounted() {
      this.loadProjType();
    },
    methods: {
      loadProjType() {
        Server.postJSON({
          url: services.dictionary.url,
          params: {
            "Account": "hong",
            "ApplicationName": "qinzhou_guihuaoa"
          },
          headers: {
            'Content-Type': "application/json"
          }
        }).then(rsp => {
          if (rsp.status === 200) {
            this.dataDictionary = rsp.message;

            this.getProjTypeTree();
            this.getLandusageTree();

          } else {
            this.$Message.error("获取字典信息失败！");
          }
        });
      },

      getProjTypeTree() {
        this.dataDictionary.forEach(v => {
          if (v.ParentCode == "1001000") {

            var item = {
              value: v.Code,
              label: v.DisplayText,
              children: []
            };

            this.getChildren(item);

            this.dataProjType.push(item);
          }
        })
      },

      getLandusageTree() {
        this.dataDictionary.forEach(v => {
          if (v.ParentCode == "322013000") {

            var item = {
              value: v.Code,
              label: v.DisplayText,
              children: []
            };

            this.getChildren(item);

            this.dataLandusage.push(item);
          }
        })
      },

      getChildren(item) {
        this.dataDictionary.forEach(v => {
          if (v.ParentCode == item.value) {
            var child = {
              value: v.Code,
              label: v.DisplayText,
              children: []
            };

            this.getChildren(child);

            item.children.push(child);
          }
        })
      },



      //重置表单
      resetForm() {
        this.form.id = "";
        this.form.name = "";
        this.form.projectNo = "";
        this.form.location = "";
        this.form.content = "";
      },
      //编辑表单
      editForm(row) {
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.projectNo = row.projectNo;
        this.form.location = row.location;
        this.form.content = row.content;

        // this.form.projectTypeCode = row.projectTypeCode;
        // this.form.projectSubTypeCode = row.projectSubTypeCode;
        // this.form.ownerCompanyId = row.ownerCompanyId;
        // this.form.constructionCompanyId = row.constructionCompanyId;   
      },

      getForm() {
                debugger;
        if (this.valueProjType.length > 1) {
          this.form.projectTypeCode = this.valueProjType[0];
          this.form.projectSubTypeCode = this.valueProjType[1];
        }
                debugger;

        if (this.form.id < 0) {
                  debugger;
          return {
            name: this.form.name,
            projectNo: this.form.projectNo,
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
        } else {
          return {
            id: this.form.id,
            name: this.form.name,
            projectNo: this.form.projectNo,
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
    }
  };
</script>