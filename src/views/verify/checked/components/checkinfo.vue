<template>
  <div class="info-box">
    <p>
      <span>申请人：</span>
      {{rowList.applyUserName}}
    </p>
    <p>
      <span>申请状态：</span>
      <tag :color="statusColor[rowList.workFlowState]">{{rowList.workFlowStateDesc}}</tag>
    </p>
    <p>
      <span>申请资源：</span>
      {{rowList.memo===""?rowList.label:rowList.memo}}
    </p>
    <p>
      <span>提供方：</span>
      {{rowList.provider}}
    </p>
    <p>
      <span>申请时间：</span>
      {{rowList.createTime==""?"":new Date(rowList.createTime).Format("yyyy-MM-dd")}}
    </p>
    <p v-if="show[rowList.workFlowState]">
      <span>审核时间：</span>
      {{rowList.updateTime==""?"":new Date(rowList.updateTime).Format("yyyy-MM-dd")}}
    </p>
    <p>
      <span>申请原因：</span>
      {{rowList.applyReason}}
    </p>
    <p v-if="reject[rowList.workFlowState]">
      <span>拒绝原因：</span>
      {{rowList.refuseReason}}
    </p>
    <Steps
      :current="current[rowList.workFlowState]"
      :status="status[rowList.workFlowState]"
      class="step"
    >
      <Step title="立即申请" content></Step>
      <Step title="申请中" content></Step>
      <Step :title="stepTitle[rowList.workFlowState]" content></Step>
    </Steps>
  </div>
</template>
<script>
import { Input, Message, Steps, Step, Tag } from "iview";
export default {
  props: {
    rowList: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      current: {
        "2": 2,
        "1": 1,
        "-1": 2
      },
      stepTitle: {
        "2": "已授权",
        "1": "完成",
        "-1": "已驳回"
      },
      statusColor: {
        "2": "green",
        "1": "yellow",
        "-1": "red"
      },
      show: {
        "2": true,
        "1": false,
        "-1": true
      },
      reject: {
        "2": false,
        "1": false,
        "-1": true
      },
      status: {
        "-1": "error",
        "2": "finish"
      }
    };
  },
  mounted() {},
  components: {
    Steps,
    Step,
    Tag
  }
};
</script>
<style lang="less" scoped>
.info-box {
  padding: 10px 20px;
  p {
    padding: 3px 0;
  }
  p span {
    display: inline-block;
    width: 70px;
  }
}
</style>


