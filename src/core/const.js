var user = null;
export const _const = {
    init() {
        user = JSON.parse(sessionStorage.getItem("userInfo"))
        window.AppId = user !== null ? user.appid : "";
        window.IP = user !== null ? user.ip : "";
        window.UserAccount = user !== null ? user.userAccount : "";
        window.OcelotEditorIP = parent.GateWayIP || "192.168.84.124:4880"; //网关映射配置
    }
};




// export const AppId = parent.AppId || "GXQDGHY";
// // export const IP = parent.IP || "192.168.84.117:1234"; //正式服务
// export const IP = parent.IP || "192.168.34.1:5006"; //测试
// // export const IP = parent.IP || "202.102.20.60:4880"; //xpw测试
// // export const IP = "202.102.20.60:4880";
// export const OcelotEditorIP = parent.GateWayIP || "192.168.84.124:4880"; //网关映射配置