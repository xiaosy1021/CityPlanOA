<template>
  <div>
    <Form
      :model="form"
      :label-width="80"
    >
      <Row>
        <Col span="24">
        <FormItem label="名称:"><Input
            v-model="form.name"
            placeholder="名称"
          /></FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
        <FormItem label="标签:"><Input
            v-model="form.label"
            placeholder="标签"
          /></FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
        <FormItem label="sql语句:"><Input
            type="textarea"
            v-model="form.querySql"
            :rows="6"
            placeholder="sql语句"
          /></FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
        <FormItem label="模板:"><Input
            v-model="form.templateName"
            placeholder="模板"
          /></FormItem>
        </Col>
      </Row>
      <FormItem label="服务链接:">
        <Row>
          <Col span="24">
          <Input
            type="textarea"
            :rows="3"
            v-model="form.serviceUrl"
            placeholder="服务链接"
          />
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <Checkbox
            label="包含参数"
            v-model="form.isAddPara"
          >包含参数</Checkbox>
          <Checkbox
            label="是否可见"
            v-model="form.visible"
          >是否可见</Checkbox>
          <Checkbox
            label="追加用户信息"
            v-model="form.addUserAccount"
          >追加用户信息</Checkbox>
          </Col>
        </Row>
      </FormItem>
      <Row>
        <Col span="24">
        <FormItem label="消息类型:">
          <Select
            clearable
            style="width:40%"
            v-model="form.msgType"
            z-index="1000"
          >
            <Option
              value="list"
              label="list"
            ><span>list</span></Option>
            <Option
              value="grid"
              label="grid"
            ><span>grid</span></Option>
            <Option
              value="line"
              label="line"
            ><span>line</span></Option>
            <Option
              value="simpleGrid"
              label="simpleGrid"
            ><span>simpleGrid</span></Option>
            <Option
              value="commonJson"
              label="commonJson"
            ><span>commonJson</span></Option>
            <Option
              value="row"
              label="row"
            ><span>row</span></Option>
          </Select>
          <Button
            style="margin-left:10px"
            type="primary"
            @click="setTemplate"
          >模板配置</Button>
        </FormItem>
        </Col>
      </Row>
      </Col>
      </Row>
    </Form>
    <Modal
      v-model="showDialog"
      :mask-closable="false"
      width="680"
      title="i查询"
    >
      <simple-grid
        ref="simpleGridForm"
        :serviceId="serviceId"
        v-if="showDialog"
      />
      <modal-footer
        slot="footer"
        @on-save="saveSimpleGrid"
        @on-cancel="onCancelsimpleGrid"
      ></modal-footer>
    </Modal>
  </div>
</template>

<script>
import SimpleGrid from "./simpleGrid.vue";
import ModalFooter from "@/components/modal-footer";
import Server from "@/core/server";
import { routerparams } from "@/core/mixins/routerp";
import { services } from "@/core/services";

export default {
  mixins: [routerparams],
  props: ["datas"],
  data() {
    return {
      serviceId: "",
      showDialog: false,
      form: {
        label: "",
        name: "",
        serviceUrl: "",
        querySql: "",
        templateName: "",
        msgType: "",
        isAddPara: false,
        visible: false,
        addUserAccount: false
      }
    };
  },
  methods: {
    //重置表单
    resetForm() {
      this.form.label = "";
      this.form.name = "";
      this.form.serviceUrl = "";
      this.form.querySql = "";
      this.form.templateName = "";
      this.form.msgType = "";
      this.form.isAddPara = false;
      this.form.visible = false;
      this.form.addUserAccount = false;
    },
    //编辑表单
    editForm(row) {
      this.serviceId = row.id;
      this.form.label = row.label;
      this.form.name = row.name;
      this.form.serviceUrl = row.serviceUrl;
      this.form.querySql = row.querySql;
      this.form.templateName = row.templateName;
      this.form.msgType = row.msgType;
      this.form.isAddPara = row.isAddPara;
      this.form.visible = row.visible;
      this.form.addUserAccount = row.addUserAccount;
    },
    //初始化新增
    getForm() {
      if (this.datas == null) {
        return {
          label: this.form.label,
          name: this.form.name,
          serviceUrl: this.form.serviceUrl,
          querySql: this.form.querySql,
          templateName: this.form.templateName,
          msgType: this.form.msgType,
          isAddPara: this.form.isAddPara,
          visible: this.form.visible,
          addUserAccount: this.form.addUserAccount,
          appid: this.AppId
        };
      } else {
        this.datas.label = this.form.label;
        this.datas.name = this.form.name;
        this.datas.serviceUrl = this.form.serviceUrl;
        this.datas.querySql = this.form.querySql;
        this.datas.templateName = this.form.templateName;
        this.datas.msgType = this.form.msgType;
        this.datas.isAddPara = this.form.isAddPara;
        this.datas.visible = this.form.visible;
        this.datas.addUserAccount = this.form.addUserAccount;
        return this.datas;
      }
    },
    setTemplate(msgType) {
      switch (this.form.msgType) {
        case "list": {
          this.$route.meta.noTrigger = true;
          this.$emit("on-close");
          this.$router.push({
            path: `/data/iSearch/${this.IP}/${this.AppId}`,
            query: {
              templateName: this.form.templateName
            }
          });
          break;
        }
        case "grid": {
          this.$route.meta.noTrigger = true;
          this.$emit("on-close");
          this.$router.push({
            path: `/data/Grid/${this.IP}/${this.AppId}`
          });
          break;
        }
        case "simpleGrid": {
          this.showDialog = true;
          break;
        }
        default: {
          this.$Message.warning("请先配置模板及消息类型信息");
          break;
        }
      }
    },
    saveSimpleGrid() {
      let tableData = this.$refs.simpleGridForm.getGrid();
      Server.post({
        url: services.getQuerySimpleGridExecute(this.AppId, this.IP),
        params: {
          params: JSON.stringify(tableData)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("操作成功");
          this.showDialog = false;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    onCancelsimpleGrid() {
      this.showDialog = false;
    }
  },
  components: {
    ModalFooter,
    SimpleGrid
  }
};
</script>