<template>
  <div class="split-style">
    <Row :style="{ height: w_splitHeight }">
      <Col span="4" class="left-col">
      <div class="left-section">
        <Row>
          <Col span="16">
          <h3 class="left-title">联系人分组</h3>
          </Col>
          <Col span="8">
          <Button icon="md-add" class="left-title-button" @click="onAdd"></Button>
          </Col>
        </Row>
        <RadioGroup vertical v-model="groupId" class="radio-group">
          <span v-for="item in roles" :key="item.id">
            <Radio :label="item.id">{{item.codeValue}}</Radio>
          </span>
        </RadioGroup>
      </div>
      </Col>
      <Col span="20" class="right-col">
      <div class="right-section">
        <Tabs value="name1">
          <TabPane label="联系人管理" name="name1">
            <user-group-manager :group-id="groupId" ref="userGroupManager"></user-group-manager>
          </TabPane>
        </Tabs>
      </div>
      </Col>
    </Row>
    <Modal v-model="showDialog" :mask-closable="false" width="600" title="分组管理">
      <group-form ref="groupForm" />
      <modal-footer slot="footer" @on-save="onSave" @on-cancel="onCancelDialog" />
    </Modal>
  </div>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { computeh } from "@/core/computeh";
import { routerparams } from "@/core/mixins/routerp";
import ModalFooter from "@/components/modal-footer";
import UserGroupManager from "./components/userGroupManager.vue";
import GroupForm from "../ContactgetFgroup/components/groupForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      showDialog: false,
      roles: [],
      groupId: ""
    };
  },
  mounted() {
    this.renderRole();
  },
  methods: {
    //获取角色列表
    renderRole() {
      Server.get({
        url: services.getContactUserGroupGetFgroup(this.AppId, this.IP)
      }).then(rsp => {
        if (rsp.status === 1) {
          this.roles = rsp.data.rcds;
          if (this.roles && this.roles.length > 0) {
            this.groupId = this.roles[0].id;
          }
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //新建角色
    onAdd() {
      this.$refs.groupForm.resetForm();
      this.showDialog = true;
    },
    //保存角色
    onSave() {
      let form = this.$refs.groupForm.getForm();
      Server.post({
        url: services.getContactUserGroupExecute(this.AppId, this.IP),
        params: {
          params: JSON.stringify(form)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("操作成功");
          this.showDialog = false;
          this.renderRole();
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //取消角色新建
    onCancelDialog() {
      this.showDialog = false;
    }
  },
  components: {
    ModalFooter,
    UserGroupManager,
    GroupForm
  }
};
</script>