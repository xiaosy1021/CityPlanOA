<template>
  <Table border :columns="columns" :data="data"></Table>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
export default {
  mixins: [routerparams],
  props: ["serviceId"],
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
          title: "名称",
          key: "name",
          width: 170,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("input", {
              domProps: {
                value: params.row.name
              },
              on: {
                input: function(event) {
                  params.row.name = event.target.value;
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
          title: "标签",
          key: "display",
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("input", {
              domProps: {
                value: params.row.display
              },
              on: {
                input: function(event) {
                  params.row.display = event.target.value;
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
          title: "宽度",
          key: "width",
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("input", {
              domProps: {
                value: params.row.width
              },
              on: {
                input: function(event) {
                  params.row.width = event.target.value;
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
          title: "对齐",
          key: "align",
          width: 100,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("input", {
              domProps: {
                value: params.row.align
              },
              on: {
                input: function(event) {
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
          title: "顺序",
          key: "order",
          width: 80,
          align: "center",
          render: (h, params) => {
            var _this = this;
            return h("input", {
              domProps: {
                value: params.row.order
              },
              on: {
                input: function(event) {
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
          title: "可见",
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
        url: services.getQuerySimpleGridAttrQuery(this.AppId, this.IP),
        params: {
          serviceId: this.serviceId
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.data = rsp.data;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    getGrid() {
      return this.data;
    }
  }
};
</script>