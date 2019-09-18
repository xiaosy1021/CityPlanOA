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
  mixins: [routerparams],
  props: ["templateName", "id"],
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
          minWidth: 100,
          align: "center",
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
          title: "名称",
          key: "name",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.name
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].name = event.target.value;
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
          key: "display",
          minWidth: 100,  
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.display
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].display = event.target.value;
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
          title: "宽",
          key: "width",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.width
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].width = event.target.value;
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
          title: "可见",
          key: "visible",
          maxWidth: 70,
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
          title: "顺序",
          key: "order",
          maxWidth: 75,
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
          title: "对齐",
          key: "align",
          maxWidth: 90,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Input", {
              props: {
                value: params.row.align
              },
              on: {
                "on-blur": event => {
                  _this.data[params.row._index].align = event.target.value;
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
          title: "隐藏",
          key: "hide",
          maxWidth: 70,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Checkbox", {
              props: {
                value: params.row.hide
              },
              on: {
                "on-change": function(val) {
                  _this.data[params.row._index].hide = val;
                }
              }
            });
          }
        },
        {
          title: "排序",
          key: "isSort",
          maxWidth: 70,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Checkbox", {
              props: {
                value: params.row.isSort
              },
              on: {
                "on-change": function(val) {
                  _this.data[params.row._index].isSort = val;
                }
              }
            });
          }
        },
        {
          title: "冻结",
          key: "frozen",
          maxWidth: 70,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("Checkbox", {
              props: {
                value: params.row.frozen
              },
              on: {
                "on-change": function(val) {
                  _this.data[params.row._index].frozen = val;
                }
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
        url: services.getQueryGridTmplAttrQuery(this.AppId, this.IP),
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