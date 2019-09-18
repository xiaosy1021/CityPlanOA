<template>
  <div class="split-style">
    <Row :style="{ height: w_splitHeight }">
      <Col
        span="4"
        class="left-col"
      >
      <div class="left-section">
        <Tree
          ref="tree"
          :data="treeData"
          :render="renderContent"
        ></Tree>
      </div>
      </Col>
      <Col
        span="20"
        class="right-col"
      >
      <div class="right-section">
        <div class="right-search-header">
          <span>名称：</span>
          <Input
            clearable
            class="search-input-default"
            v-model="searchName"
            @on-enter="onSearch"
          />
          <search-buttons
            @on-search="onSearch"
            @on-refresh="onRefresh"
            @on-add="onAdd"
          ></search-buttons>
        </div>
        <Table
          :loading="isLoading"
          border
          :height="w_splitTableHeight"
          :columns="table.columns"
          :data="table.data"
        ></Table>
      </div>
      </Col>
      <Modal
        v-model="showDialog"
        :mask-closable="false"
        width="600"
        title="新增统计"
      >
        <business-stats-form
          ref="businessStatsForm"
          :datas="datas"
          :group="currentGroup"
        />
        <modal-footer
          slot="footer"
          @on-save="onSave"
          @on-cancel="onCancelDialog"
        ></modal-footer>
      </Modal>
    </Row>
  </div>
</template>
<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import { computeh } from "@/core/computeh";
import { renderHelper } from "@/core/common";
import ModalFooter from "@/components/modal-footer";
import SearchButtons from "@/components/search-buttons";
import BusinessStatsForm from "./components/BusinessStatsForm.vue";

export default {
  mixins: [computeh, routerparams],
  data() {
    return {
      datas: null,
      showDialog: false,
      isLoading: false,
      currentGroup: "",
      searchName: "",
      treeData: [],
      table: {
        columns: [
          {
            title: "名称",
            key: "name",
            sortable: true,
            align: "center"
          },

          {
            title: "标签",
            key: "label",
            align: "center"
          },

          {
            title: "IntType",
            key: "initType",
            align: "center"
          },
          {
            title: "服务地址",
            key: "serviceUrl",
            minWidth: 80,
            align: "center"
          },
          {
            title: "顺序",
            key: "order",
            align: "center"
          },
          {
            title: "高",
            key: "height",
            align: "center"
          },
          {
            title: "宽",
            key: "width",
            align: "center"
          },
          {
            title: "风格",
            key: "showStyle",
            align: "center"
          },
          {
            title: "表格",
            key: "isShowGridData",
            maxWidth: 75,
            render: (h, params) => {
              return renderHelper.renderTagForTable(
                h,
                params.row.isShowGridData
              );
            },
            align: "center"
          },
          {
            title: "图表",
            key: "isShowChart",
            maxWidth: 75,
            render: (h, params) => {
              return renderHelper.renderTagForTable(h, params.row.isShowChart);
            },
            align: "center"
          },
          {
            title: "移动端",
            key: "isMobileAvailable",
            maxWidth: 75,
            render: (h, params) => {
              return renderHelper.renderTagForTable(
                h,
                params.row.isMobileAvailable
              );
            },
            align: "center"
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            minWidth: 40,
            render: (h, params) => {
              return renderHelper.renderDefaultOpterForTable(
                h,
                params,
                this.onEdit,
                this.onDelete
              );
            }
          },
          {
            title: "跳转",
            key: "action",
            align: "center",
            maxWidth: 80,
            render: (h, params) => {
              return renderHelper.renderActionButtonForTable(
                h,
                params,
                this.toService
              );
            }
          },
          {
            title: "服务名称",
            key: "serviceKeyName",
            align: "center",
            render: (h, params) => {
              let _this = this;
              return h("Input", {
                props: {
                  value: params.row.serviceKeyName
                },
                on: {
                  "on-blur": event => {
                    _this.table.data[params.row._index].serviceKeyName =
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
            title: "绑定",
            key: "action",
            align: "center",
            maxWidth: 80,
            render: (h, params) => {
              return renderHelper.renderBindButtonForTable(
                h,
                params,
                this.onBind
              );
            }
          }
        ],
        data: []
      }
    };
  },
  activated() {
    if (this.$route.meta.noTrigger === true) {
      this.$route.meta.noTrigger = false;
    } else {
      this.currentGroup = "";
      this.searchName = "";
      this.renderMenu();
    }
  },
  mounted() {
    this.renderMenu();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      return renderHelper.renderDefaultNodeForTree(
        h,
        { root: root, node: node, data: data },
        this.selectionClick,
        this.$refs.tree
      );
    },
    //获取列表
    renderMenu() {
      Server.get({
        url: services.getBusinessStatsFgroup(this.AppId, this.IP) + this.AppId
      }).then(rsp => {
        if (rsp.status === 1) {
          rsp.data = rsp.data.filter(item => {
            return item.title;
          });
          let result = renderHelper.findNodeChildren(
            { children: rsp.data },
            this.currentGroup,
            { keyProp: "title" }
          );
          if (result === true) {
          } else {
            rsp.data[0].isSelected = true;
            this.currentGroup = rsp.data[0].title;
          }
          this.treeData = rsp.data;
          this.onSearch();
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //详情查询
    selectionClick(node) {
      let group = node.title;
      this.currentGroup = group;
      this.loadTable(group);
    },
    onSearch() {
      if (!this.currentGroup) {
        this.$Message.warning("请选择一个节点");
        return;
      }
      this.loadTable(this.currentGroup, this.searchName);
    },
    loadTable(group, name) {
      this.isLoading = true;
      Server.get({
        url: services.getBusinessStatsQuery(this.AppId, this.IP),
        params: {
          Fgroup: group,
          name: name
        }
      }).then(rsp => {
        this.isLoading = false;
        if (rsp.status === 1) {
          this.table.data = rsp.data.rcds;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    onBind(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        Server.post({
          url: services.getServiceBinding(this.AppId, this.IP),
          params: {
            params: JSON.stringify({
              appid: currentRow.appid,
              servicename: currentRow.serviceKeyName,
              funid: currentRow.id
            })
          }
        }).then(rsp => {
          if (rsp.status === 1) {
            this.$Message.success("操作成功");
            this.onRefresh();
          } else {
            this.$Message.error(rsp.message);
          }
        });
      }
    },
    toService(currentRow, index) {
      this.$route.meta.noTrigger = true;
      this.$router.push({
        path: `/function/serviceManage/${this.IP}/${this.AppId}`,
        query: {
          name: currentRow.serviceKeyName
        }
      });
    },
    onAdd() {
      this.showDialog = true;
      this.datas = null;
      this.$refs.businessStatsForm.resetForm();
    },
    //删除
    onDelete(currentRow, index) {
      if (!currentRow) {
        this.$Message.warning("请选择需要删除的行");
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "是否永久删除此数据?",
          onOk: () => {
            Server.get({
              url:
                services.getBusinessStatsDelete(this.AppId, this.IP) +
                currentRow.id
            }).then(rsp => {
              if (rsp.status == 1) {
                this.$Message.success("删除成功");
                this.onRefresh();
              } else {
                this.$Message.error(rsp.message);
              }
            });
          },
          onCancel: () => {}
        });
      }
    },
    onEdit(currentRow, index) {
      this.datas = currentRow;
      if (!currentRow) {
        this.$Message.warning("请选择需要操作的行");
      } else {
        this.$refs.businessStatsForm.editForm(currentRow);
        this.showDialog = true;
      }
    },
    onRefresh() {
      this.renderMenu();
    },
    //保存
    onSave() {
      let form = this.$refs.businessStatsForm.getForm();
      if (form.fgroup == "") {
        this.$Message.warning("分组不可为空");
        return;
      }
      Server.post({
        url: services.getBusinessStatsExecute(this.AppId, this.IP),
        params: {
          params: JSON.stringify(form)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.$Message.success("操作成功");
          this.showDialog = false;
          this.onRefresh();
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //取消
    onCancelDialog() {
      this.showDialog = false;
    }
  },
  components: {
    BusinessStatsForm,
    SearchButtons,
    ModalFooter
  }
};
</script>