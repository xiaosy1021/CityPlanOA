import Server from "@/core/server";
import { services } from "@/core/services";
export default class LigerGrid {
  constructor() {}
  getConfig(opt) {
    return {
      rownumbers: opt.rownumbers || true,
      checkbox: opt.checkbox || false,
      rowDraggable: opt.rowDraggable === true ? opt.rowDraggable : false,
      pageSize: opt.pageSize || 10,
      pageSizeOptions: opt.pageSizeOptions || [10, 20, 50],
      height: opt.height || "100%",
      method: opt.method || "get",
      // url: services.grid + opt.url,
      url: services.grid(opt.url),
      page: opt.page || 1,
      parms: opt.parms || {},
      columns: opt.columns,
      allowAdjustColWidth: true,
      fixedCellHeight: true
    };
  }
  //获取头部信息
  getHeader(name) {
    return new Promise(resolve => {
      Server.get({
        url: services.col + name
      }).then(rsp => {
        resolve(rsp.data);
      });
    });
  }
}
