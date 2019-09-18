<template>
  <i-form :model="form" :rules="ruleKey" :label-width="100">
    <Row>
      <i-col span="14">
        <FormItem label="服务标识:" prop="KeyId">
          <i-input v-model="form.KeyId" size="large" :disabled="!isAdd">
            <span slot="prepend">{{appId}}_</span>
          </i-input>
        </FormItem>
      </i-col>
      <i-col span="10">
        <FormItem label="请求方式:">
          <i-select multiple v-model="form.UpstreamHttpMethod">
            <i-option value="Get">Get</i-option>
            <i-option value="Post">Post</i-option>
          </i-select>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem label="是否Token认证:">
          <RadioGroup v-model="form.AuthenticationOptions">
            <i-radio label="是">是</i-radio>
            <i-radio label="否">否</i-radio>
          </RadioGroup>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem label="网关地址:" prop="UpstreamPathTemplate">
          <i-input v-model="form.UpstreamPathTemplate" size="large" placeholder="例如:/test/url"/>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem label="URL地址:" prop="Url">
          <i-input
            v-model="form.Url"
            size="large"
            type="textarea"
            :rows="3"
            placeholder="例如:http://localhost:8080/url"
          />
        </FormItem>
      </i-col>
    </Row>
  </i-form>
</template>
<script>
import {
  Form,
  FormItem,
  Row,
  Col,
  Select,
  Option,
  Radio,
  RadioGroup,
  Icon,
  Tag
} from "iview";
export default {
  props: {
    appId: {
      type: String,
      default: ""
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    keys: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    const validateKey = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("服务标识不能为空"));
      }
      if (this.keys.indexOf(value) > -1) {
        callback(new Error("服务标识已存在，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      form: {
        Index: this.data.Index,
        AppId: this.appId,
        KeyId: this.data.KeyId || "",
        AuthenticationOptions: this.data.AuthenticationOptions || "是",
        UpstreamPathTemplate: this.data.UpstreamPathTemplate || "",
        UpstreamHttpMethod: (this.data.UpstreamHttpMethod || "Get").split(","),
        Url: this.data.Url || ""
      },
      ruleKey: {
        KeyId: [{ required: true, validator: validateKey, trigger: "blur" }],
        UpstreamPathTemplate: [
          { required: true, message: "网关地址不能为空", trigger: "blur" }
        ],
        Url: [
          {
            required: true,
            type: "url",
            message: "URL地址不合法",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    iForm: Form,
    FormItem,
    iRow: Row,
    iCol: Col,
    iSelect: Select,
    iOption: Option,
    iRadio: Radio,
    RadioGroup: RadioGroup,
    Icon: Icon,
    Tag
  }
};
</script>