<template>
  <div class="page-style">
    <div class="gateHeader search-header">
      <span>服务标识：</span>
      <Input clearable class="control search-input-default" v-model="serviceValue" />
      <span>网关地址：</span>
      <Input clearable class="control search-input-default" v-model="gatewayValue" />
      <Button type="primary" icon="md-search" disabled @click="onSearch">查询</Button>
      <Button type="primary" icon="md-add" disabled @click="onAdd">新建</Button>
      <Button type="primary" icon="md-refresh" disabled @click="onRestart">重启</Button>
    </div>
    <div class="section">
      <Table highlight-row stripe border :height="w_height-180" :columns="table.columns" :data="table.data"></Table>
    </div>
    <Modal v-model="dialog" :mask-closable="false" width="650" title="网关管理">
      <gateway ref="gatewayform" :isAdd="isAdd" :appId="appId" :keys="keys" :data="selectedRow" v-if="dialog"></gateway>
      <modal-footer slot="footer" @on-save="onSaveGateway" @on-cancel="onCancelGateway" :loading="loading"></modal-footer>
    </Modal>
    <div ref="loadings" :class="{loading:isLoading}"></div>
  </div>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { AppId } from "@/core/services";
import GateWayStore from "./store/gateway-store";
import { computeh } from "@/core/computeh";
import ModalFooter from "@/components/modal-footer";
export default {
  mixins: [computeh],
  data() {
    return {
      id: null,
      dialog: false,
      loading: false,
      isLoading: false,
      serviceValue: "",
      gatewayValue: "",
      appId: AppId,
      isAdd: true,
      keys: [],
      selectedRow: null,
      data: [],
      tData: [],
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "服务标识",
            key: "KeyId",
            align: "center"
          },
          {
            title: "网关地址",
            key: "UpstreamPathTemplate",
            align: "left"
          },
          {
            title: "请求方式",
            key: "UpstreamHttpMethod",
            align: "center"
          },
          {
            title: "是否Token认证",
            key: "AuthenticationOptions",
            maxWidth: 120,
            align: "center",
            render: (h, params) => {
              return h(
                "Tag",
                {
                  props: {
                    color:
                      params.row.AuthenticationOptions === 1 ? "green" : "red",
                    type: "dot"
                  }
                },
                params.row.AuthenticationOptions === 1 ? "是" : "否"
              );
            }
          },
          {
            title: "URL地址",
            key: "Url",
            align: "left"
          },
          {
            title: "操作",
            key: "action",
            maxWidth: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("Button", {
                  props: {
                    shape: "circle",
                    icon: "compose"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.onRowClick(params.row, params.index);
                    }
                  }
                }),
                h("Button", {
                  props: {
                    shape: "circle",
                    icon: "ios-trash-outline"
                  },
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                })
              ]);
            }
          }
        ],
        data: []
      }
    };
  },
  watch: {
    data() {
      this.tData = this.data;
    },
    tData() {
      var data = [];
      var keys = [];
      this.tData.forEach(item => {
        var port =
          item.DownstreamHostAndPorts[0].Port === 80
            ? ""
            : `:${item.DownstreamHostAndPorts[0].Port}`;

        var route = {
          KeyId: item.Key,
          UpstreamPathTemplate: item.UpstreamPathTemplate,
          UpstreamHttpMethod: item.UpstreamHttpMethod.join(","),
          Url: `${item.DownstreamScheme}://${
            item.DownstreamHostAndPorts[0].Host
          }${port}${item.DownstreamPathTemplate}`,
          AppId: item.AppId
        };
        route.AuthenticationOptions = item.AuthenticationOptions ? 1 : 0;
        data.push(route);
        keys.push(item.Key);
      });
      this.table.data = data;
      this.keys = keys;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    //获取初始列表
    initData() {
      this.$Message.warning("该功能暂未开通");
      return;
      this.getLoading();
      Server.get({
        url: services.GetGateway
      }).then((rsp, status) => {
        this.id = rsp.id;
        this.data = JSON.parse(rsp.jsonString).ReRoutes;
      });
    },
    getLoading() {
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },
    //编辑
    onRowClick(currentRow, index) {
      currentRow.Index = index;
      this.selectedRow = currentRow;
      this.isAdd = false;
      this.dialog = true;
    },
    //搜索
    onSearch() {
      this.tData = this.data.filter(item => {
        if (this.serviceValue !== "") {
          if (this.serviceValue === "") {
            return true;
          } else if (typeof item.Key === "string") {
            return item.Key.search(this.serviceValue) > -1;
          } else {
            return false;
          }
        } else {
          if (this.gatewayValue === "") {
            return true;
          } else if (typeof item.UpstreamPathTemplate === "string") {
            return item.UpstreamPathTemplate.search(this.gatewayValue) > -1;
          } else {
            return false;
          }
        }
      }); //过滤的新数组
    },
    //新增
    onAdd() {
      this.selectedRow = {};
      this.isAdd = true;
      this.dialog = true;
    },
    //删除
    remove(index) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否永久删除此记录?",
        onOk: () => {
          this.data.splice(index, 1);
          // Server.post({
          //   url:""
          // }).then(rsp => {
          //   this.$Message.success("删除成功");
          // });
          alert(api接口未启用);
        },
        onCancel: () => {}
      });
    },
    //保存
    onSaveGateway() {
      var row = this.$refs.gatewayform.form;
      if (row.Url == "" || row.Url == "" || row.UpstreamPathTemplate == "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$Message.error("表单不完整，请继续填写");
        }, 1000);
      } else {
        if (this.isAdd) {
          var gateWayStore = new GateWayStore();
          var route = gateWayStore.getRoute(row);
          this.data.splice(0, 0, route);
          this.dialog = false;
        } else {
          var gateWayStore = new GateWayStore();
          var dataRow = gateWayStore.upDate(row);
          this.data.splice(dataRow.Index, 1, dataRow);
          this.dialog = false;
        }
        var routes = {
          ReRoutes: this.data
        };
        var jsonString = JSON.stringify(routes);
        this.validate(jsonString).then(rsp => {
          if (rsp.netStatus === 200 && rsp.isError === false) {
            Server.post({
              url: services.SaveGateWay,
              params: {
                jsonString: jsonString,
                name: AppId,
                id: this.id
              }
            }).then(rsp => {
              this.$Message.success("保存成功");
            });
          } else {
            this.$Message.error(rsp.errors.join(","));
          }
        });
      }
    },
    //验证
    validate(jsonString) {
      return new Promise(resolve => {
        Server.post({
          url: services.Validate,
          params: {
            jsonString: jsonString,
            name: AppId
          }
        }).then(rsp => {
          resolve(rsp);
        });
      });
    },
    //取消
    onCancelGateway() {
      this.dialog = false;
    },
    //重启
    onRestart() {
      this.$Modal.confirm({
        title: "提示",
        content: "是否重启网关？",
        onOk: () => {
          Server.get({
            url: services.RestartGateWay
          }).then(rsp => {
            this.$Message.success("重启成功");
          });
        },
        onCancel: () => {}
      });
    }
  },
  components: {
    ModalFooter,
    gateway: resolve => require(["./components/gatewayForm.vue"], resolve)
  }
};
</script>
<style lang="less" scoped>
.search-header .ivu-btn-primary {
  margin-right: 3px;
}
</style>

