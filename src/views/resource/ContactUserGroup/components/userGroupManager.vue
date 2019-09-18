<template>
  <Transfer filterable :data="transferdata" :titles="titles" :target-keys="targetKeys" :list-style="listStyle" @on-change="onChange"></Transfer>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams],
  props: {
    groupId: String
  },
  watch: {
    groupId: "renderUser"
  },
  data() {
    return {
      transferdata: [],
      targetKeys: [],
      titles: ["可选用户", "已选用户"],
      listStyle: {
        width: "305px",
        height: "400px"
      }
    };
  },
  methods: {
    renderUser() {
      Server.get({
        url: services.getContactUserGroupQuery(this.AppId, this.IP),
        params: { id: this.groupId }
      }).then(rsp => {
        if (rsp.status === 1) {
          let targetKeys = [];
          let _data = [];
          rsp.data.rcds.forEach(item => {
            _data.push({
              key: item.id,
              label: item.userName
            });
            if (item.chosened === true) {
              targetKeys.push(item.id);
            }
          });
          this.transferdata = _data;
          this.targetKeys = targetKeys;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    onChange(newTargetKeys) {
      Server.post({
        url: services.getContactUserGroupSet(this.AppId, this.IP),
        params: {
          params: JSON.stringify({
            GroupId: this.groupId,
            appid: this.AppId,
            contactUserIds: newTargetKeys
          })
        }
      }).then(rsp => {
        if (rsp.status === 1) {
        } else {
          this.$Message.error(rsp.message);
        }
        this.renderUser();
      });
    }
  },
};
</script>
