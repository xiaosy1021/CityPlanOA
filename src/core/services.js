// var user = null || JSON.parse(sessionStorage.getItem("userInfo"))
var newbaseUrl = "";
var AppId = "";
var IP = "";
var OcelotEditorUrl = "";
// if (user != null) {
//   var IP = user.ip;
//   var AppId = user.appid;
//   var newbaseUrl = `http://${IP}/onemapsrv/admin/`;
// }
export const AppId = AppId || "";
// var OcelotEditorUrl = `http://${OcelotEditorIP}/ConfigEditor/`; //接口url

// //地图审核管理模块
var mapCheckbaseUrl = `http://${IP}/onemapsrv/Srv/MapLayer/`;

export const services = {

  //登陆地址
  login: `http://192.168.84.24:12345/onemapsrv/login?appid=ams`,
  //本地json数据--menu
  menu: `static/json/menu.json`,
  //运维独立服务
  grid(name) {
    return newbaseUrl + `${name}/Query?appid=${AppId}`;
  },
  //登录模块
  Login: newbaseUrl + 'Login',
  //统计模块
  Getnumbers(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Statistics/Base?appid=${AppId}`;
  },
  //基础信息管理=>
  //用户管理模块
  getUserQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/User/Query?appid=${AppId}`;
  },
  getUserExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/User/AddOrEdit?appid=${AppId}`;
  },
  getUserDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/User/Delete/`;
  },
  //角色管理模块
  getRoleQuery(AppId, IP) {

    return `http://${IP}/onemapsrv/admin/Role/Query?appid=${AppId}`;
  },
  getRoleExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Role/AddOrEdit?appid=${AppId}`;
  },
  getRoleDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Role/Delete/`;
  },
  //图层管理
  getMapLayerGetAllTree(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapLayer/GetAllTree?appid=${AppId}`;
  },
  getMapLayerGetSubMapLayers(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapLayer/GetSubMapLayers/`;
  },
  getMapLayerExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapLayer/AddOrEdit/`;
  },
  getMapLayerDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapLayer/Delete/`;
  },
  getMapLayerDrag(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapLayer/Drag/`;
  },
  // Token管理
  getTokenQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Token/Query?appid=${AppId}`;
  },
  getTokenExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Token/AddOrEdit?`;
  },
  getTokenDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Token/Delete/`;
  },
  //角色权限=>
  //角色用户管理模块 
  getRoleUserQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/RoleUser/Query?appid=${AppId}`;
  },
  getRoleUserExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/RoleUser/Set`;
  },
  //工具管理模块
  getMapToolGetAllTree(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapTool/GetAllTree?appid=${AppId}`;
  },
  getMapToolGetSubTools(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapTool/GetSubTools/`;
  },
  getMapToolDetail(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapTool/Detail/`;
  },
  getMapToolExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapTool/AddOrEdit/`;
  },
  getMapToolDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapTool/Delete/`;
  },
  //菜单管理模块
  getMenuGetAllTree(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Menu/GetAllTree?appid=${AppId}`;
  },
  getMenuGetSubMenus(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Menu/GetSubMenus/`;
  },
  getMenuExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Menu/AddOrEdit/`;
  },
  getMenuDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Menu/Delete/`;
  },
  getMenuDrag(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Menu/Drag/`;
  },
  //地图信息
  getMapInfoQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapInfo/Query?appid=${AppId}`;
  },
  getMapInfoExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapInfo/AddOrEdit/`;
  },
  getMapInfoDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/MapInfo/Delete/`;
  },
  //模板详情
  getModuleQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Module/Query?appid=${AppId}`;
  },
  getModuleExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Module/AddOrEdit/`;
  },
  getModuleDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Module/Delete/`;
  },
  //I查询
  getQueryListTmplQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryListTmpl/Query?appid=${AppId}`;
  },
  getQueryListTmplDetail(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryListTmpl/Detail/`;
  },
  getQueryListTmplExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryListTmpl/AddOrEdit/`;
  },
  getQueryListTmplDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryListTmpl/Delete/`;
  },
  getQueryListTmplAttrQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryListTmplAttr/Query/`;
  },
  getQueryListTmplAttrSave(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryListTmplAttr/Save/`;
  },
  //URL配置
  getUrlQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Url/Query?appid=${AppId}`;
  },
  getUrlExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Url/AddOrEdit/`;
  },
  getUrlDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Url/Delete/`;
  },
  //应用查询
  getAppQuery(IP) {
    return `http://${IP}/onemapsrv/admin/App/Query`;
  },
  getAppExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/App/AddOrEdit/`;
  },
  getAppDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/App/Delete/`;
  },
  //服务列表 
  getServiceQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Service/Query?appid=${AppId}`;
  },
  getServiceExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Service/AddOrEdit/`;
  },
  getServiceDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Service/Delete/`;
  },
  getServiceBinding(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Service/Banding/`;
  },
  //短信模板
  getShortMsgTmplQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ShortMsgTmpl/Query?appid=${AppId}`;
  },
  getShortMsgTmpldetail(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ShortMsgTmpl/Detail/`;
  },
  getShortMsgTmplExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ShortMsgTmpl/AddOrEdit/`;
  },
  getShortMsgTmplDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ShortMsgTmpl/Delete/`;
  },
  //查询模块
  getSearchQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BussinessQuery/Query/?appid=${AppId}`;
  },
  getSearchFgroup(IP) {
    return `http://${IP}/onemapsrv/admin/BussinessQuery/Fgroup/`;
  },
  getSearchExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BussinessQuery/AddOrEdit/`;
  },
  getSearchDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BussinessQuery/Delete/`;
  },
  //统计模块
  getBusinessStatsQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BusinessStats/Query/?appid=${AppId}`;
  },
  getBusinessStatsFgroup(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BusinessStats/Fgroup/`;
  },
  getBusinessStatsExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BusinessStats/AddOrEdit/`;
  },
  getBusinessStatsDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/BusinessStats/Delete/`;
  },
  //Grid模块
  getQueryGridTmplQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryGridTmpl/Query?appid=${AppId}`;
  },
  getQueryGridTmplDetail(AppId, IP) {

    return `http://${IP}/onemapsrv/admin/QueryGridTmpl/Detail/`;
  },
  getQueryGridTmplExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryGridTmpl/AddOrEdit/`;
  },
  getQueryGridTmplDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryGridTmpl/Delete/`;
  },
  getQueryGridTmplAttrQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryGridTmplAttr/Query/`;
  },
  getQueryGridTmplAttrSave(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QueryGridTmplAttr/Save/`;
  },
  //快查模块
  getQuickQueryQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QuickQuery/Query?appid=${AppId}`;
  },
  getQuickQueryDetail(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QuickQuery/Detail/`;
  },
  getQuickQueryExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QuickQuery/AddOrEdit/`;
  },
  getQuickQueryDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QuickQuery/Delete/`;
  },
  //邮件模块
  getEmailMsgTmplQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/EmailMsgTmpl/Query?appid=${AppId}`;
  },
  getEmailMsgTmpldetail(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/EmailMsgTmpl/Detail/`;
  },
  getEmailMsgTmplExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/EmailMsgTmpl/AddOrEdit/`;
  },
  getEmailMsgTmplDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/EmailMsgTmpl/Delete/`;
  },
  //联系人分组查询
  getContactUserGroupQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUserGroup/Query?appid=${AppId}`;
  },
  getContactUserGroupGetFgroup(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUserGroup/GetFgroup/?category=联系人分组`;
  },
  getContactUserGroupSet(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUserGroup/Set/`;
  },
  getContactUserGroupDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUserGroup/Delete/`;
  },
  getContactUserGroupExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUserGroup/AddOrEdit/`;
  },
  //联系人查询
  getContactUserQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUser/Query?appid=${AppId}`;
  },
  getContactUserExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUser/AddOrEdit/`;
  },
  getContactUserDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/ContactUser/Delete/`;
  },
  //simpleGrid模块
  getQuerySimpleGridAttrQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/QuerySimpleGridAttr/Query/`;
  },
  getQuerySimpleGridExecute(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/uerySimpleGridAttr/Save/`;
  },
  //菜单权限=>快速查询Tab模块  
  getRoleFunQuery(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/RoleFun/Query?appid=${AppId}&roleid=`;
  },
  getRoleFunSet(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/RoleFun/Set`;
  },
  // Tabquery: newbaseUrl + `RoleFun/Query?appid=${AppId}&roleid=`, //tab查询
  // Tabexecute: newbaseUrl + `RoleFun/Set`, //tab设置
  //网关模块

  GetGateway: OcelotEditorUrl + `GetOcelotSection?name=${AppId}`, //网关查询
  // GetGateway: OcelotEditorUrl + `GetAllOcelotSections`, //全部网关查询
  RestartGateWay: OcelotEditorUrl + `ReBuiltOcelotConfiguration`, //网关重启
  SaveGateWay: OcelotEditorUrl + `SaveOcelotSection`, //保存网关
  Validate: OcelotEditorUrl + "ValidateOcelotSection", //验证方法
  //地图申请审核模块
  CheckList: mapCheckbaseUrl + `CheckList`, //地图申请待审核列表
  Check: mapCheckbaseUrl + `Check`, //审核
  //HasCheckList: mapCheckbaseUrl + `HasCheckList?` //已审核

  //应用管理模块
  getAppList(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Application/Query`;
  },
  getAppSave(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Application/AddOrEdit`;
  },
  getAppDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Application/Delete/`;
  },

  //环境管理模块
  getEnvList(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Environment/Query/`;
  },
  getEnvSave(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Environment/AddOrEdit`;
  },
  getEnvDelete(AppId, IP) {
    return `http://${IP}/onemapsrv/admin/Environment/Delete/`;
  },

};