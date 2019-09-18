<template>
  <div>
    <Table height="500" border :columns="columns" :data="data"></Table>
    <div style="text-align:right;margin-top:10px">
      <Button icon="md-add" @click="addProp">添加新属性</Button>
    </div>
  </div>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { renderHelper } from "@/core/common";

export default {
  props: ["templateName", "id"],
  mixins: [routerparams],
  data() {
    return {
      propData: [],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },

        {
          title: "模板",
          key: "templateName",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.templateName
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].templateName =
                    event.target.value;
                }
              },
              style: {
                display: "inline-block",
                border: "0px"
              }
            });
          }
        },

        {
          title: "属性",
          key: "columnName",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.columnName
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].columnName = event.target.value;
                }
              },
              style: {
                display: "inline-block",
                border: "0px"
              }
            });
          }
        },

        {
          title: "描述",
          key: "label",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.label
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].label = event.target.value;
                }
              },
              style: {
                display: "inline-block",
                border: "0px"
              }
            });
          }
        },

        {
          title: "单位",
          key: "valueUnit",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.valueUnit
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].valueUnit = event.target.value;
                }
              },
              style: {
                display: "inline-block",
                border: "0px"
              }
            });
          }
        },

        {
          title: "精度",
          key: "precision",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.precision
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].precision = event.target.value;
                }
              },
              style: {
                display: "inline-block",
                border: "0px"
              }
            });
          }
        },

        {
          title: "属性可见",
          maxWidth: 90,
          key: "visible",
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Checkbox", {
              props: {
                value: params.row.visible
              },
              on: {
                "on-change": function(val) {
                  _this.data[params.row._index].visible = val;
                }
              },
              data: () => {
                return {
                  checked: false
                };
              }
            });
          }
        },
        {
          title: "列表可见",
          key: "listVisible",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Checkbox", {
              props: {
                value: params.row.listVisible
              },
              on: {
                "on-change": function(val) {
                  _this.data[params.row._index].listVisible = val;
                }
              }
            });
          }
        },
        {
          title: "顺序",
          key: "order",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.order
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].order = event.target.value;
                }
              },
              style: {
                display: "inline-block",
                border: "0px"
              }
            });
          }
        },
        {
          title: "操作",
          key: "id",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            return renderHelper.renderSingleButtonForTable(
              h,
              params,
              this.removeProp,
              "移除",
              "ios-trash"
            );
          }
        }
      ],
      data: []
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
    getTable() {
      Server.get({
        url: services.getQueryListTmplAttrQuery(this.AppId, this.IP),
        params: {
          templateName: this.templateName,
          templateId: this.id,
          appid: this.AppId
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.data = rsp.data;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    getProp() {
      return this.data;
    },
    removeProp(currentRow, index) {
      if (!currentRow.columnName) {
        this.data.splice(index, 1);
        return;
      }
      this.$Modal.confirm({
        title: "提示",
        content: "是否移除该属性?",
        onOk: () => {
          this.data.splice(index, 1);
        },
        onCancel: () => {}
      });
    },
    addProp() {
      this.data.push({
        appid: this.AppId,
        templateName: this.templateName,
        order: this.data.length + 1
      });
    }
  }
};
</script>