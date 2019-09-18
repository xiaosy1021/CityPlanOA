<template>
  <div class="page-style">
    <div class="checkHeader search-header">
      <span>申请人：</span>
      <Input clearable class="control search-input-default" v-model="UserName"/>
      <span>资源名称：</span>
      <Input clearable class="control search-input-default" v-model="label" @on-enter="onSearch" />
      <Button type="primary" icon="md-search" disabled @click="onSearch">查询</Button>
      <Button type="primary" icon="md-close" disabled @click="onReset">重置</Button>
    </div>
    <div class="main-table-section">
      <Table :loading="loading" border :height="w_paginationHeight" :columns="table.columns" :data="table.data"></Table>
    </div>
    <div class="foot-page">
      <Page :total="total" show-total @on-change="onChangePage"></Page>
    </div>
    <Modal v-model="dialog" :mask-closable="false" width="600" :title="modalTile" @on-cancel="onCancel">
      <i-input v-model="txt_input" type="textarea" :rows="6" placeholder="（必填）请输入内容..." v-if="reject===1"></i-input>
      <div v-if="reject===2">
        <Checkinfo :rowList="rowList"></Checkinfo>
      </div>
      <modal-check slot="footer" :class="{ passBtn: isPassbtn }" @on-cancel="onReject" @on-save="onPass" v-if="waitButton"></modal-check>
    </Modal>
  </div>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { computeh } from "@/core/computeh";
import { routerparams } from "@/core/mixins/routerp";
import { Input, Button, Message, Modal, Table, Page } from "iview";
import ModalCheck from "@/components/modal-check";
export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      UserName: "",
      label: "",
      loading: false,
      modal: false,
      txt_input: "",
      dialog: false,
      table: {
        columns: [
          {
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "申请人",
            key: "applyUserName",
            align: "center"
          },
          {
            title: "资源名称",
            key: "label",
            align: "center"
          },
          {
            title: "提供方",
            key: "provider",
            align: "center"
          },
          {
            title: "申请原因",
            key: "applyReason"
          },
          {
            title: "状态",
            key: "workFlowStateDesc",
            align: "center",
            render: (h, params) => {
              var color = "";
              switch (params.row.workFlowState) {
                case -1:
                  color = "red";
                  break;
                case 1:
                  color = "yellow";
                  break;
                case 2:
                  color = "green";
                  break;
              }
              return h(
                "Tag",
                {
                  props: {
                    color: color
                  }
                },
                params.row.workFlowStateDesc
              );
            }
          },
          {
            title: "操作",
            maxWidth: 200,
            key: "action",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "i-button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      width: "100px"
                    },
                    on: {
                      click: a => {
                        this.onCheck(params.row.workFlowState, params);
                      }
                    }
                  },
                  params.row.workFlowState === 1 ? "审核" : "查看"
                )
              ]);
            }
          }
        ],
        data: []
      },
      tData: [],
      rowList: [],
      total: 0,
      reject: "2",
      isPassbtn: false,
      modalTile: "",
      waitButton: false
    };
  },
  computed: {
    check() {
      return '';
      // return getQueryString("check");
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData(page = 1, pageSize = 10) {
      Message.warning("该功能暂未开通");
      return;
      Server.get({
        url:
          services.CheckList +
          `?check=${this.check}&page=${page}&pagesize=${pageSize}`
      }).then(rsp => {
        if (rsp.status === 1) {
          this.table.data = rsp.data.rcds;
          this.total = rsp.data.total;
        } else {
          Message.error(rsp.message);
        }
      });
    },
    //查询
    onSearch() {
      this.tData = this.table.data.filter(item => {
        if (this.UserName !== "") {
          if (this.UserName === "") {
            return true;
          } else if (typeof item.applyUserName === "string") {
            return item.applyUserName.search(this.UserName) > -1;
          } else {
            return false;
          }
        } else {
          if (this.label === "") {
            return true;
          } else if (typeof item.label === "string") {
            return item.label.search(this.label) > -1;
          } else {
            return false;
          }
        }
      });
      this.table.data = this.tData;
    },
    onReset() {
      this.initData();
      this.UserName = "";
      this.label = "";
    },
    onPass() {
      var applyId = this.rowList.id;
      Server.post({
        url: services.Check,
        params: {
          params: JSON.stringify({
            applyId: applyId,
            result: true
          })
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("审核通过");
          this.dialog = false;
          this.reject = "2";
          this.initData(); //刷新
        } else {
          Message.error(rsp.message);
        }
      });
    },
    //驳回
    onReject() {
      var reason = this.txt_input;
      var applyId = this.rowList.id;
      if (reason == "") {
        this.reject = 1;
        this.isPassbtn = true;
        this.modalTile = "拒绝原因";
      } else {
        Server.post({
          url: services.Check,
          params: {
            params: JSON.stringify({
              applyId: applyId,
              result: false,
              reason: reason
            })
          }
        }).then(rsp => {
          if (rsp.status === 1) {
            this.$Message.success("已驳回");
            this.initData();
            this.dialog = false;
            this.reject = "2";
            this.isPassbtn = false;
            this.txt_input = "";
          } else {
            Message.error(rsp.message);
          }
        });
      }
    },
    //操作
    onCheck(State, params) {
      //this.row = params.row;
      this.rowList = params.row;
      this.dialog = true;
      this.reject = 2;
      this.modalTile = "待审核信息";
      if (this.check === "wait") {
        this.waitButton = true;
      } else {
      }
    },
    //待审核的X close
    onCancel() {
      this.reject = 2;
      this.isPassbtn = false;
      this.txt_input = "";
    },
    //分页
    onChangePage(page) {
      this.initData(page);
    }
  },
  components: {
    iTable: Table,
    Modal,
    Page,
    ModalCheck,
    Checkinfo: resolve => require(["./components/checkinfo.vue"], resolve)
  }
};
</script>
<style lang="less" scoped>
.passBtn button:last-child {
  display: none;
}
.step {
  margin-top: 20px;
}
.control {
  width: 200px;
}
.reject {
  display: none;
}
.checktime {
  display: none;
}
.search-header .ivu-btn-primary {
  margin-right: 3px;
}
</style>


