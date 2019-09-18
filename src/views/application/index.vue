<template>
  <div>
    <div class="env-page">
      <div class="search-top">
        <img src="@/assets/img/env/left.png">
        <span class="search-text">项目搜搜</span>
        <img src="@/assets/img/env/right.png">
      </div>

      <div class="search-widget">
        <Input
          v-model="search_text"
          search
          size="large"
          enter-button
          @on-search="onSearch"
          placeholder="请输入 项目名称、AppID、关键字 等关键信息进行搜索，如：智慧苏相"
        />
      </div>
      <div class="result-message">
        <span>共查询到 {{appList.length}} 项目</span>
        <Button
          type="primary"
          icon="md-add"
          title="新增项目"
          style="margin-left:469px;"
          @click="onAddApp"
        >新增</Button>
      </div>
      <div class="search-list">
        <div v-for="item in appList" :key="item.id">
          <div class="pub_show">
            <div class="pub_tit">
              <div class="pub_titleft">{{item.projName}}</div>

              <Dropdown class="pub_titrt" @on-click="onManageApp($event,item)">
                <a href="javascript:void(0)">操作
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="edit">编辑</DropdownItem>
                  <DropdownItem name="del">删除</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <div class="pub_titrt" style="margin-right:20px;" @click="onClickApp(item.id)">
                <a>应用环境&gt;&gt;</a>
              </div>
            </div>
            <div class="pub_con">
              <div class="pub_img">
                <img
                  :src="item.logo"
                  onerror="javascript:this.src='http://122.193.33.86:8006/sharefiles/ProjMgrWeb/NoImg_Sipsd.png'"
                  height="144"
                  width="144"
                >
              </div>
              <div class="pub_pro">
                <div class="pub_dw">
                  <strong>AppID：</strong>
                  <span>{{item.appId}}</span>
                </div>
                <div class="pub_dw">
                  <strong>负责人：</strong>
                  <span>{{item.dutyUser}}</span>
                </div>
                <div class="pub_dw">
                  <strong>创建时间：</strong>
                  <span>{{item.createTime ===""?"":new Date(item.createTime).Format("yyyy-MM-dd")}}</span>
                  <span class="chasm"></span>
                  <strong>更新时间：</strong>
                  <span>{{item.updateTime ===""?"":new Date(item.updateTime).Format("yyyy-MM-dd")}}</span>
                </div>
                <div class="pub_dw">
                  <strong>账户：</strong>
                  <span>{{item.testAccount}}</span>
                  <span style="margin-left: 30px;"></span>
                  <strong>密码：</strong>
                  <span>{{item.testPsw}}</span>
                </div>
                <div class="pub_dw">
                  <strong>备注：</strong>
                  <span>{{item.remark}}</span>
                </div>

                <div class="pub_dw">
                  <strong class="gjztit">关键字：</strong>
                  <div class="gjz">
                    <span v-for="gjz in item.keyNames" :key="gjz.id">{{gjz}}</span>
                  </div>
                </div>
              </div>

              <div class="more-detail" title="详细项目信息" @click="onExpandDetail(item.id)">
                <Icon :type="item.showDetail===false?'ios-arrow-down':'ios-arrow-up'"></Icon>
              </div>

              <!-- 项目详细信息 -->
              <div class="more-content" v-show="item.showDetail">
                <div class="pub_dw">
                  <strong>合同编号：</strong>
                  <span>{{item.contractNo}}</span>
                </div>

                <div class="pub_dw">
                  <strong>省、市、区：</strong>
                  <span>{{item.province}}</span>
                  <span class="space">-</span>
                  <span>{{item.city}}</span>
                  <span class="space">-</span>
                  <span>{{item.district}}</span>
                </div>

                <div class="pub_dw">
                  <strong>甲方/委托方：</strong>
                  <span>{{item.owner}}</span>
                </div>

                <div class="pub_dw">
                  <strong>合同签订日期：</strong>
                  <span>{{item.contractDate===""?"":new Date(item.contractDate).Format("yyyy-MM-dd")}}</span>
                </div>

                <div class="pub_dw">
                  <strong>合同金额：</strong>
                  <span>{{item.contractAmount}}万元</span>
                </div>
                <div class="pub_dw">
                  <strong>已付款比例：</strong>
                  <span>{{item.payPercent}}%</span>
                </div>

                <div class="pub_dw">
                  <strong>项目周期：</strong>
                  <span>{{item.projStartDate ===""?"":new Date(item.projStartDate).Format("yyyy-MM-dd")}}</span>
                  <span class="space">至</span>
                  <span>{{item.projEndDate===""?"":new Date(item.projEndDate).Format("yyyy-MM-dd")}}</span>
                </div>
                <div class="pub_dw">
                  <strong>预算提交日期：</strong>
                  <span>{{item.projBudgetDate===""?"":new Date(item.projBudgetDate).Format("yyyy-MM-dd")}}</span>
                </div>
                <div class="pub_dw">
                  <strong>项目阶段：</strong>
                  <span>{{item.projStep}}</span>
                </div>
                <div class="pub_dw">
                  <strong>项目进度百分比：</strong>
                  <span>{{item.projProgressPercent}}%</span>
                </div>
                <div class="pub_dw">
                  <strong>项目经理：</strong>
                  <span>{{item.projManager}}</span>
                </div>
                <div class="pub_dw">
                  <strong>PMO进度：</strong>
                  <span>{{item.pmoStep}}</span>
                </div>
                <div class="pub_dw" style="width:660px;">
                  <strong>项目进度描述：</strong>
                  <span>{{item.projProgressDetail}}</span>
                </div>

                <div class="pub_dw" style="width:660px;">
                  <strong>下一步工作内容：</strong>
                  <span>{{item.projNextStep}}</span>
                </div>

                <div class="pub_dw" style="width:660px;">
                  <strong>项目备注：</strong>
                  <span>{{item.projRemark}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="showDialogApp" :mask-closable="false" width="800" title="新增/编辑 项目">
      <app-form ref="appForm" :datas="dataApp"></app-form>
      <modal-footer slot="footer" @on-save="onSaveApp" @on-cancel="onCancelDialog"></modal-footer>
    </Modal>

    <Modal v-model="showDialogEnv" :mask-closable="false" width="480" title="新增/编辑 应用环境">
      <env-form ref="envForm" :datas="dataEnv"></env-form>
      <modal-footer slot="footer" @on-save="onSaveEnv" @on-cancel="onCancelDialog"></modal-footer>
    </Modal>

    <Drawer title="应用环境" :closable="false" width="750" v-model="showDrawer">
      <Button
        type="primary"
        icon="md-add"
        title="新增应用环境"
        @click="onAddEnv"
        style="margin-left: 630px;"
      >新增</Button>

      <div v-for="item in envList" :key="item.id">
        <div class="pub_show_env">
          <div class="pub_tit">
            <div class="pub_titleft">{{item.label}}</div>
            <!-- <div class="pub_titrt" v-show="item.url !==''">
                <a :href="item.url" target="_blank">地址&gt;&gt;</a>
            </div>-->
            <Dropdown class="pub_titrt" @on-click="onManageEnv($event,item)">
              <a href="javascript:void(0)">操作
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="edit">编辑</DropdownItem>
                <DropdownItem name="del">删除</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="pub_con">
            <div class="pub_img">
              <img
                :src="item.qr"
                height="150"
                width="150"
                onerror="javascript:this.src='http://122.193.33.86:8006/sharefiles/ProjMgrWeb/NoImg_Sipsd.png'"
              >
            </div>
            <div class="pub_pro">
              <div class="pub_dw">
                <strong>设备：</strong>
                <span>{{item.device}}</span>
              </div>
              <div class="pub_dw">
                <strong>负责人：</strong>
                <span>{{item.dutyUser}}</span>
              </div>
              <div class="pub_dw">
                <strong>创建时间：</strong>
                <span>{{item.createTime ===""?"":new Date(item.createTime).Format("yyyy-MM-dd")}}</span>
              </div>

              <div class="pub_dw">
                <strong>备注：</strong>
                <span>{{item.remark}}</span>
              </div>
              <div class="pub_dw">
                <strong>Url地址：</strong>
                <a :href="item.url" target="_blank">{{item.url}}</a>
              </div>
              <div class="pub_dw">
                <strong>视频地址：</strong>
                <a :href="item.videoUrl" target="_blank">{{item.videoUrl}}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
    <Spin fix v-show="isLoading">加载中...</Spin>
  </div>
</template>
<script>
import "@/core/utils/prototype";
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";
import ModalFooter from "@/components/modal-footer";
import AppForm from "./components/appAddForm.vue";
import EnvForm from "./components/envAddForm.vue";

export default {
  mixins: [routerparams],
  data() {
    return {
      isLoading: false,
      search_text: "",
      appList: [],
      showDialogApp: false,
      showDialogEnv: false,
      dataApp: null,
      dataEnv: null,
      showDrawer: false,
      currentPid: null,
      envList: []
    };
  },
  mounted() {
    this.IP = "58.210.9.131";  //正式环境
    // this.IP = "192.168.34.1:5001";  //本机测试环境
    this.queryList(this.search_text);
  },
  methods: {
    onSearch() {
      this.queryList(this.search_text);
    },
    queryList(txt) {
      Server.get({
        url: services.getAppList(this.AppId, this.IP),
        params: {
          search_text: txt
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.appList = rsp.data;
        }
      });
    },

    onExpandDetail(id) {
      var app = this.appList.find(item => {
        return item.id.indexOf(id) > -1;
      });

      app.showDetail = !app.showDetail;
    },

    onClickApp(pid) {
      this.currentPid = pid;
      this.envList = [];
      this.isLoading = true;
      Server.get({
        url: services.getEnvList(this.AppId, this.IP) + pid
      }).then(rsp => {
        if (rsp.status === 1) {
          this.envList = rsp.data;
          this.isLoading = false;
          this.showDrawer = true;
        }
      });
    },

    onAddApp() {
      this.showDialogApp = true;
      this.dataApp = null;
      this.$refs.appForm.resetForm();
    },
    //保存
    onSaveApp() {
      debugger;
      let form = this.$refs.appForm.getForm();
      Server.post({
        url: services.getAppSave(this.AppId, this.IP),
        params: {
          params: JSON.stringify(form)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.showDialogApp = false;
          this.queryList("");
          this.$Message.success("保存成功！");
        } else {
          this.$Message.error(rsp.message);
        }
      });
    },
    //取消
    onCancelDialog() {
      this.showDialogApp = false;
      this.showDialogEnv = false;
    },

    onManageApp(name, item) {
      if (name === "del") {
        this.deleteApp(item.id);
      } else if (name === "edit") {
        this.editApp(item);
      }
    },
    //编辑
    editApp(item) {
      this.dataApp = item;
      this.$refs.appForm.editForm(item);
      this.showDialogApp = true;
    },
    //删除
    deleteApp(id) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除此应用?",
        onOk: () => {
          Server.get({
            url: services.getAppDelete(this.AppId, this.IP) + id
          }).then(rsp => {
            if (rsp.status === 1) {
              this.queryList("");
              this.$Message.success("删除成功");
            }
          });
        },
        onCancel: () => {}
      });
    },

    onAddEnv() {
      this.showDialogEnv = true;
      this.dataEnv = null;
      this.$refs.envForm.resetForm(this.currentPid);
    },
    onManageEnv(name, item) {
      if (name === "del") {
        this.deleteEnv(item);
      } else if (name === "edit") {
        this.editEnv(item);
      }
    },

    editEnv(item) {
      debugger;
      this.dataEnv = item;
      this.$refs.envForm.editForm(item);
      this.showDialogEnv = true;
    },
    deleteEnv(item) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除此环境?",
        onOk: () => {
          Server.get({
            url: services.getEnvDelete(this.AppId, this.IP) + item.id
          }).then(rsp => {
            if (rsp.status === 1) {
              this.onClickApp(item.pid);
              this.$Message.success("删除成功");
            }
          });
        },
        onCancel: () => {}
      });
    },

    onSaveEnv() {
      debugger;
      let form = this.$refs.envForm.getForm();
      Server.post({
        url: services.getEnvSave(this.AppId, this.IP),
        params: {
          params: JSON.stringify(form)
        }
      }).then(rsp => {
        if (rsp.status === 1) {
          this.showDialogEnv = false;
          this.onClickApp(this.currentPid);
          this.$Message.success("保存成功！");
        } else {
          this.$Message.error(rsp.message);
        }
      });
    }
  },
  components: {
    ModalFooter,
    AppForm,
    EnvForm
  }
};
</script>

<style lang="less">
html,
body,
#app {
  background: white;
}

.env-page {
  width: 1024px;
  text-align: center;
  margin: 0 auto;

  .search-top {
    padding: 36px 0px 22px 0px;
    text-align: center;

    img {
      padding-bottom: 10px;
      vertical-align: middle;
    }

    .search-text {
      font-size: 28px;
      color: #4679b2;
      padding: 0px 20px 0px 20px;
    }
  }

  .search-widget {
    width: 680px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .result-message {
    width: 680px;
    margin: 0 auto;
    color: #337ab7;
    text-align: left;
    font-size: 16px;
  }
  .search-list {
    width: 800px;
    margin: 0 auto;
  }
}

.pub_show {
  width: 698px;
  margin: 10px auto;
  // padding: 15px;
  padding: 15px 15px 0 15px;
  border: 1px solid #ddd;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.pub_show_env {
  width: 698px;
  margin: 10px auto;
  padding: 15px;
  border: 1px solid #ddd;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.pub_tit {
  overflow: auto;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 3px;
  margin-bottom: 15px;

  .pub_titleft {
    display: inline;
    font-size: 18px;
    color: #333;
    font-family: 微软雅黑, Arial;
    margin-left: 3px;
  }

  .pub_titrt {
    display: inline;
    margin-right: 3px;
  }
}
.pub_con {
  overflow: hidden;

  .pub_img {
    display: inline;
  }

  .pub_pro {
    display: inline;
    margin-left: 30px;
    overflow: hidden;

    .pub_dw {
      overflow: hidden;
      color: #666;
      font-size: 13px;
      margin-top: 5px;
      float: left;
      width: 501px;
      text-align: left;

      .gjztit {
        display: block;
        float: left;
      }

      .gjz {
        display: inline;

        span {
          background: #337ab7;
          padding: 3px 4px;
          margin-left: 6px;
          color: #fff;
          text-align: center;
          border-radius: 5px;
          font-size: 12px;
          font-family: "微软雅黑", Arial;
          display: inline-block;
        }
      }
    }
  }

  .more-detail {
    overflow: hidden;
    color: #2d8cf0;
    font-size: 13px;
    padding: 10px 0;
    float: left;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }

  .more-content {

    display: inline;

    .pub_dw {
      overflow: hidden;
      color: #666;
      font-size: 13px;
      margin-top: 5px;
      float: left;
      width: 330px;
      text-align: left;

      .gjztit {
        display: block;
        float: left;
      }

      .gjz {
        display: inline;

        span {
          background: #337ab7;
          padding: 3px 4px;
          margin-left: 6px;
          color: #fff;
          text-align: center;
          border-radius: 5px;
          font-size: 12px;
          font-family: "微软雅黑", Arial;
          display: inline-block;
        }
      }
    }
  }

  .space {
    margin: 0 5px;
  }

  .chasm{
    margin: 0 20px;
  }
}
</style>


