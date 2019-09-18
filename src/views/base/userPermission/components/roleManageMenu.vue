<template>
  <div>
    <Transfer filterable :data="transferdata" :titles="titles" :target-keys="targetKeys" :list-style="listStyle" @on-change="onChange"></Transfer>
  </div>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { Button, Message, Tabs, TabPane, Transfer } from "iview";
export default {
  mixins: [routerparams],
  props: {
    roleid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      transferdata: [],
      targetKeys: [],
      titles: ["待选用户", "已选用户"],
      listStyle: {
        width: "305px",
        height: "400px"
      }
    };
  },
  computed: {
    id() {
      return getQueryString("id");
    }
  },
  methods: {
    renderUser(id) {
      var targetKeys = [];
      Server.get({
        url: services.getRoleUserQuery(this.AppId, this.IP) + "&roleid=" + id
      }).then(rsp => {
        if (rsp.status === 1) {
          var _data = [];
          rsp.data.rcds.forEach(item => {
            _data.push({
              key: item.userId,
              label: item.label
            });
            if (item.value == true) {
              targetKeys.push(item.userId);
            }
          });
          this.transferdata = _data;
          this.targetKeys = targetKeys;
        } else {
          Message.error(rsp.message);
        }
      });
    },
    onChange(newTargetKeys) {
      this.targetKeys = newTargetKeys;
      Server.post({
        url: services.getRoleUserExecute(this.AppId, this.IP),
        params: {
          params: JSON.stringify({
            roleId: this.roleid,
            userIds: newTargetKeys
          })
        }
      }).then(rsp => {
        if (rsp.status === 1) {
        } else {
          Message.error(rsp.message);
        }
      });
    }
  },
  components: {
    Transfer
  }
};
</script>
