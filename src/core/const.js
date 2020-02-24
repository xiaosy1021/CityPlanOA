// var user = null;
// export const _CONSTCFG = {
//     AppId: "SX_KJXX",
//     IP: "192.168.72.9:5008",
//     init() {
//         debugger;
//         user = JSON.parse(sessionStorage.getItem("userInfo"))

//         window.IP = "192.168.72.9:5008";
//         window.AppId = "SX_KJXX";

//         window.UserAccount = user !== null ? user.userAccount : "";
//     }
// };


var _CONSTCFG = {
    AppId: "SX_KJXX",
    IP: "122.193.33.86:8006",
    SrvIP: "192.168.84.124:5088",

    //字典
    DataDictionary: [],
    //项目类型 级联选择
    DataProjType: [],
    //用地性质 级联选择
    DataLandusage: [],
    //文档类型
    DataDocType:[],
    //书证类型
    DataCertType:[],
    //申请类型
    DataApplicationType:[]

};

export const CONSTCFG = _CONSTCFG;