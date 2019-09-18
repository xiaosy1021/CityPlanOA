<template>
  <div class="page-style">
    <div class="header">
      <Row>
        <Col span="24">
          <!-- <h2 class="total-title">后台统计量</h2> -->
        </Col>
        <Col span="24">
          <!-- <p class="line"></p> -->
        </Col>
      </Row>
      
    </div>
    <div class="section">
      <Row>
        <Col span="5" offset="0">
          <div class="info-box">
            <div class="num-info">
              <h3>{{NumberList.users}}</h3>
              <h4>用户数量</h4>
            </div>
            <div class="icon-info">
              <Icon type="ios-people"></Icon>
            </div>
          </div>
        </Col>
        <Col span="5" offset="1">
          <div class="info-box">
            <div class="num-info">
              <h3>{{NumberList.roles}}</h3>
              <h4>角色数量</h4>
            </div>
            <div class="icon-info">
              <Icon type="person-add"></Icon>
            </div>
          </div>
        </Col>
        <Col span="5" offset="1">
          <div class="info-box">
            <div class="num-info">
              <h3>{{NumberList.layers}}</h3>
              <h4>服务量</h4>
            </div>
            <div class="icon-info">
              <Icon type="ios-navigate"></Icon>
            </div>
          </div>
        </Col>
        <Col span="5" offset="1">
          <div class="info-box">
            <div class="num-info">
              <h3>{{NumberList.services}}</h3>
              <h4>访问量</h4>
            </div>
            <div class="icon-info">
              <Icon type="eye"></Icon>
            </div>
          </div>
        </Col>
      </Row>
      <Row style="margin-top:50px">
        <Col span="5" offset="0">
          <!-- <Card >
            <p slot="title">
              <Icon type="speakerphone"></Icon>
            TOP:10 排行榜
            </p>
            <ul class="top-list">
             <li v-for="tab in tabs" :key="tab.id">
              {{tab.id}}. {{ tab.text }}
             </li>
           </ul>
         </Card> -->
        </Col>
        <Col span="17" offset="1" >
          <!-- <h3 class="user-list">用户列表</h3>
          <Table  :columns="columns1" :data="data1" height="340"></Table> -->
        </Col>
      </Row> 
    </div>
  </div>
</template>
<script>
import { routerparams } from "@/core/mixins/routerp";
import Server from "@/core/server";
import { services } from "@/core/services";
export default {
  mixins: [routerparams],
  data() {
    return {
      NumberList: {
        users: "0",
        roles: "0",
        layers: "0",
        services: "0"
      },
      columns1: [],
      data1: [],
      tabs: []
    };
  },
  mounted() {
    this.initNumberData();
  },
  methods: {
    initNumberData() {
      Server.get({
        url: services.Getnumbers(this.AppId, this.IP)
      }).then((rsp, status) => {
        if (rsp.status === 1) {
          this.NumberList = rsp.data;
        } else {
          this.$Message.error(rsp.message);
        }
      });
    }
  },
  components: {}
};
</script>

<style scope>
body {
  /* background: #fff; */
}
.page-style .header {
  border: 1px solid #fff;
}
/* .total-title {
  font-weight: normal;
  font-size: 20px;
  margin: 15px 0;
}
.line {
  width: 100%;
  height: 1px;
  background: #eee;
} */
.section {
  padding: 10px;
}
.info-box {
  border: 1px solid #ddd;
  border-radius: 2px;
  height: 120px;
  transition: all 0.2s ease-in-out;
}
.info-box:hover {
  border: 1px solid #dddee1;
  border-color: #e9eaec;
  -moz-box-shadow: 1px 1px 12px #e9eaec;
  -webkit-box-shadow: 1px 1px 12px #e9eaec;
  box-shadow: 1px 1px 6px #e9eaec;
}
.info-box .num-info {
  float: left;
  width: 45%;
}
.info-box .num-info h3 {
  margin: 35px 10px 0 40px;
  font-size: 24px;
}
.info-box .num-info h4 {
  width: 90px;
  margin: 0 40px;
  font-size: 14px;
  font-weight: normal;
}
.info-box .icon-info {
  float: right;
  width: 45%;
  font-size: 70px;
}
.info-box .icon-info i {
  width: 80px;
  height: 80px;
  margin: 30px 0 10px 0px;
  text-align: center;
}
.top-list li {
  padding: 5px 10px;
}
.user-list {
  padding: 15px 15px;
  border: 1px solid #eee;
}
.ivu-table th {
  background-color: #fff;
}
</style>
