// Array find by name
(function () {
  Array.prototype.remove = function (id) {
    if (this.length > 0) {
      this.splice(this.indexOf(id), 1);
    }
  };

  Array.prototype.max = function () {
    if (this.length === 0) return null;
    if (this instanceof Array) {
      var max = this[0];
      for (var i = 1; i < this.length; i++) {
        if (this[i] > max) {
          max = this[i];
        }
      }
      return max;
    } else {
      console.log(typeof (this));
      return null;
    }
  };

  Array.prototype.min = function () {
    if (this.length === 0) return null;
    if (this instanceof Array) {
      var min = this[0];
      for (var i = 0; i < this.length; i++) {
        if (this[i] < min) {
          min = this[i];
        }
      }
      return min;
    } else {
      console.log(typeof (this));
      return null;
    }
  };

  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
  };

  String.prototype.clear = function () {
    return this.replace(/[\r\n]/g, "");
  };
})();
