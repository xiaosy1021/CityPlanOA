  <template>
  <Tabs size="small" value="name1">
    <TabPane label="基本信息" name="name1">
      <Form :model="form" :label-width="90" :rules="ruleValidate">
        <Row>
          <Col span="12">
            <FormItem label="图层ID:">
              <Input v-model="form.id" disabled placeholder="ID"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图例:">
              <Input v-model="form.legend" placeholder="图例"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图层名称:" prop="name">
              <Input v-model="form.name" placeholder="图层名称"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图层类型:">
              <Select clearable style="width:100%" v-model="form.layerType">
                <Option value="group" label="group">
                  <span>group</span>
                </Option>
                <Option value="tile" label="tile">
                  <span>tile</span>
                </Option>
                <Option value="dynamic" label="dynamic">
                  <span>dynamic</span>
                </Option>
                <Option value="tpk" label="tpk">
                  <span>tpk</span>
                </Option>
                <Option value label>
                  <span>空</span>
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图层标签:" prop="label">
              <Input v-model="form.label" placeholder="图层标签"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="要素类型:">
              <Select clearable style="width:100%" v-model="form.geometryType">
                <Option value="点" label="点">
                  <span>点</span>
                </Option>
                <Option value="线" label="线">
                  <span>线</span>
                </Option>
                <Option value="面" label="面">
                  <span>面</span>
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图层列表:">
              <Input v-model="form.visibleLayers" placeholder="图层列表"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="备注:">
              <Input v-model="form.memo" placeholder="备注"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图层列表-An:">
              <Input v-model="form.visibleLayersAndroid" placeholder="图层列表-An"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="过滤字段:">
              <Input v-model="form.filter" placeholder="过滤字段"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="Token:">
              <Select clearable style="width:100%" v-model="form.tokenName">
                <Option
                  v-for="token in tokenList"
                  :value="token.name"
                  :key="token.name"
                >{{token.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="透明度:">
              <Input v-model="form.opacity" placeholder="透明度"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="排序:">
              <Input v-model="form.order" placeholder="排序"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图标:">
              <Input v-model="form.imgSrc" placeholder="图标"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="功能:">
              <CheckboxGroup>
                <Checkbox label="可见" v-model="form.defaultVisible"></Checkbox>
                <Checkbox label="可用" v-model="form.enabled"></Checkbox>
                <Checkbox label="可共享" v-model="form.isShare"></Checkbox>
                <Checkbox label="底图图层" v-model="form.isBaseLayer"></Checkbox>
                <Checkbox label="显示为新数据" v-model="form.isShowNewSign"></Checkbox>
                <Checkbox label="是否已选" v-model="form.isChecked"></Checkbox>
                <Checkbox label="组内可多选" v-model="form.isGroupChecked"></Checkbox>
                <Checkbox label="是否展开（组有效）" v-model="form.isExpand"></Checkbox>
                <Checkbox label="是否支持图层查询" v-model="form.isSupportLayerQuery"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="服务地址:">
              <Input type="text" v-model="form.serviceUrl" placeholder="服务地址"/>
            </FormItem>
          </Col>
          <Col span="24" style="padding:0 10px">
            <Divider style="margin:0 0 10px 0" orientation="left">i查询</Divider>
            <Row style="padding:0 20px">
              <Col span="24">
                <Checkbox label="支持i查询" v-model="form.isSupportIQuery">是否支持i查询</Checkbox>
              </Col>
              <Col span="12">
                <FormItem label="查询方式:">
                  <RadioGroup v-model="form.queryType">
                    <Radio :disabled="!form.isSupportIQuery" label="1">
                      <span>表查询</span>
                    </Radio>
                    <Radio :disabled="!form.isSupportIQuery" label="2">
                      <span>Rest查询</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="9">
                <FormItem label="模板配置:">
                  <Input
                    v-model="form.tableName"
                    placeholder="模板名"
                    :disabled="!form.isSupportIQuery"
                  />
                </FormItem>
              </Col>
              <Col span="2" offset="1">
                <Button @click="toList">i查询</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </TabPane>
    <TabPane label="数据内容" name="name2">
      <Form :model="form" :label-width="90">
        <Row>
          <Col span="24">
            <FormItem label="提供方:">
              <Input v-model="form.provider" placeholder="提供方"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="moreUrl:">
              <Input v-model="form.moreUrl" placeholder="moreUrl"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="资源描述:">
              <Input
                type="textarea"
                :rows="2"
                v-model="form.resourceDescription"
                placeholder="资源描述"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="质量描述:">
              <Input
                type="textarea"
                :rows="2"
                v-model="form.qualityDescription"
                placeholder="质量描述"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="更新时间:">
              <DatePicker
                type="date"
                placeholder="选择时间"
                format="yyyy-MM-dd"
                v-model="form.updateTime"
                style="width:100%;"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="截止时间:">
              <DatePicker
                type="date"
                placeholder="选择时间"
                format="yyyy-MM-dd"
                v-model="form.expiration"
                style="width:100%;"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </TabPane>
    <TabPane label="离线地图" name="name3">
      <Form :model="form" :label-width="90">
        <Row>
          <Col span="24">
            <FormItem label="离线地图:">
              <Input
                v-model="form.OfflineText"
                placeholder="离线地图"
                type="textarea"
                :rows="20"
                clearable
              />
            </FormItem>
          </Col>
          <Col span="24" style="text-align:right">
            <pre id="jsonBlock" hidden>{{jsonObj}}</pre>
            <Checkbox v-model="showQuot">引号</Checkbox>
            <Button @click="formatJSON">格式化</Button>
          </Col>
        </Row>
      </Form>
    </TabPane>
  </Tabs>
</template>

<script>
import Server from "@/core/server";
import { services } from "@/core/services";
import { routerparams } from "@/core/mixins/routerp";

export default {
  mixins: [routerparams],
  props: ["parentId"],
  data() {
    return {
      jsonObj: null,
      showQuot: false,
      tokenList: [],
      form: {
        id: "",
        layerType: "",
        geometryType: "",
        Appid: "",
        tableName: "",
        updateTime: "",
        expiration: "",
        provider: "",
        resourceDescription: "",
        name: "",
        label: "",
        templateName: "",
        tokenName: "",
        imgSrc: "",
        serviceUrl: "",
        queryType: "",
        order: "",
        filter: "",
        visibleLayers: "",
        memo: "",
        visibleLayersAndroid: "",
        legend: "",
        opacity: "",
        moreUrl: "",
        OfflineText: "",
        Offline: "",
        defaultVisible: true,
        isShare: "false",
        enabled: false,
        isBaseLayer: false,
        isShowNewSign: false,
        isSupportLayerQuery: false,
        isSupportIQuery: false,
        isChecked: false,
        isExpand: false,
        isGroupChecked: false,
        pid: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "图层名称不能为空",
            trigger: "blur"
          }
        ],
        label: [
          {
            required: true,
            message: "图层标签不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    Server.get({
      url: services.getTokenQuery(this.AppId, this.IP),
      params: {}
    }).then(rsp => {
      if (rsp.status === 1) {
        this.tokenList = rsp.data.rows;
      }
    });
  },
  methods: {
    toList() {
      //进行查询跳转时，为了保证后退时，页面能够保持当前状态，将noTrigger的值设为true，在页面的activated
      this.$route.meta.noTrigger = true;
      //因为设置了keep-alive，Modal并不会关闭，需要触发事件
      this.$emit("on-close");
      this.$router.push({
        path: `/data/iSearch/${this.IP}/${this.AppId}`,
        query: {
          templateName: this.form.tableName
        }
      });
    },

    //重置表单
    resetForm() {
      this.form.id = "";
      this.form.name = "";
      this.form.label = "";
      this.form.layerType = "";
      this.form.imgSrc = "";
      this.form.geometryType = "";
      this.form.tokenName = "";
      this.form.queryType = "";
      this.form.moreUrl = "";
      this.form.order = "";
      this.form.serviceUrl = "";
      this.form.visibleLayers = "";
      this.form.memo = "";
      this.form.visibleLayersAndroid = "";
      this.form.legend = "";
      this.form.filter = "";
      this.form.legend = "";
      this.form.opacity = "";
      this.form.expiration = "";
      this.form.Appid = "";
      this.form.tableName = "";
      this.form.updateTime = "";
      this.form.provider = "";
      this.form.resourceDescription = "";
      this.form.Pid = "";
      this.form.defaultVisible = true;
      this.form.enabled = false;
      this.form.isBaseLayer = false;
      this.form.isShowNewSign = false;
      this.form.isSupportLayerQuery = false;
      this.form.isSupportIQuery = false;
      this.form.isChecked = false;
      this.form.isShare = false;
      this.form.isGroupChecked = false;
      this.form.isExpand = false;
      this.form.qualityDescription = "";
      this.form.OfflineText = "";
      this.form.Offline = "";
    },
    //编辑表单
    editForm(row) {
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.label = row.label;
      this.form.order = row.order;
      this.form.layerType = row.layerType;
      this.form.geometryType = row.geometryType;
      this.form.tokenName = row.tokenName;
      this.form.visibleLayersAndroid = row.visibleLayersAndroid;
      this.form.queryType = String(row.queryType);
      this.form.memo = row.memo;
      this.form.visibleLayers = row.visibleLayers;
      this.form.serviceUrl = row.serviceUrl;
      this.form.legend = row.legend;
      this.form.filter = row.filter;
      this.form.moreUrl = row.moreUrl;
      this.form.legend = row.legend;
      this.form.opacity = row.opacity;
      this.form.expiration = row.expiration;
      this.form.Appid = row.Appid;
      this.form.imgSrc = row.imgSrc;
      this.form.tableName = row.tableName;
      this.form.updateTime = row.updateTime;
      this.form.provider = row.provider;
      this.form.resourceDescription = row.resourceDescription;
      this.form.defaultVisible = row.defaultVisible;
      this.form.enabled = row.enabled;
      this.form.isBaseLayer = row.isBaseLayer;
      this.form.isShowNewSign = row.isShowNewSign;
      this.form.isSupportLayerQuery = row.isSupportLayerQuery;
      this.form.isSupportIQuery = row.isSupportIQuery;
      this.form.isChecked = row.isChecked;
      this.form.isGroupChecked = row.isGroupChecked;
      this.form.isShare = row.isShare;
      this.form.isExpand = row.isExpand;
      this.form.qualityDescription = row.qualityDescription;
      this.form.OfflineText = row.offline;
      this.formatJSON();
    },
    //初始化新增
    getForm() {
      if (this.form.OfflineText) {
        try {
          let obj = eval("(" + this.form.OfflineText + ")");
          if (typeof obj === "object" && obj != null) {
            this.form.Offline = JSON.stringify(obj);
          } else {
            throw "not a object";
          }
        } catch (ex) {
          this.$Message.error("离线地图的JSON格式错误");
          return null;
        }
      } else {
        this.form.Offline = "";
      }
      return {
        id: this.form.id,
        name: this.form.name,
        label: this.form.label,
        layerType: this.form.layerType,
        geometryType: this.form.geometryType,
        tokenName: this.form.tokenName,
        serviceUrl: this.form.serviceUrl,
        legend: this.form.legend,
        filter: this.form.filter,
        memo: this.form.memo,
        legend: this.form.legend,
        queryType: this.form.queryType,
        tableName: this.form.tableName,
        opacity: this.form.opacity,
        imgSrc: this.form.imgSrc,
        expiration: this.form.expiration,
        defaultVisible: this.form.defaultVisible,
        enabled: this.form.enabled,
        isBaseLayer: this.form.isBaseLayer,
        isShowNewSign: this.form.isShowNewSign,
        isSupportLayerQuery: this.form.isSupportLayerQuery,
        isSupportIQuery: this.form.isSupportIQuery,
        isChecked: this.form.isChecked,
        isShare: this.form.isShare,
        isGroupChecked: this.form.isGroupChecked,
        resourceDescription: this.form.resourceDescription,
        qualityDescription: this.form.qualityDescription,
        provider: this.form.provider,
        order: this.form.order,
        updateTime: this.form.updateTime,
        isExpand: this.form.isExpand,
        moreUrl: this.form.moreUrl,
        visibleLayers: this.form.visibleLayers,
        visibleLayersAndroid: this.form.visibleLayersAndroid,
        Appid: this.AppId,
        pid: this.parentId,
        Offline: this.form.Offline
      };
    },
    formatJSON() {
      if (this.form.OfflineText) {
        try {
          let obj = eval("(" + this.form.OfflineText + ")");
          if (typeof obj === "object" && obj != null) {
            this.jsonObj = obj;
            setTimeout(() => {
              let str = document.getElementById("jsonBlock").innerHTML;
              if (this.showQuot === false) {
                str = str.replace(/\"(\w*)\":/g, "$1:");
              }
              this.form.OfflineText = str;
            }, 200);
          } else {
            throw "not a object";
          }
        } catch (ex) {
          this.$Message.error("JSON对象格式错误");
        }
      }
    }
  }
};
</script>