import Axios from "axios";
import QS from "qs";
import {
  debug
} from "util";
export default class Server {
  static _token = null;

  static setToken(token) {
    this._token = token;
  }

  static get(opt) {
    return new Promise((resolve, reject) => {
      this.setInitAxios();
      Axios.get(encodeURI(opt.url), {
        params: opt.params || {}
      }).then(function (rsp) {
        rsp.data.netStatus = rsp.status;
        resolve(rsp.data);
      });
    });
  }

  static getDownloadFile(opt) {
    return new Promise((resolve, reject) => {
      this.setInitAxios();
      Axios.get(encodeURI(opt.url), {
        responseType: 'blob',
        params: opt.params || {},
        headers: opt.headers || {}
      }).then(function (rsp) {
        if(opt.callback){
          opt.callback(rsp);
          return;
        }
        if (rsp.data != "") {
          var url = window.URL.createObjectURL(rsp.data);
          var link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', opt.fileName || '');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    });
  }

  static post(opt) {
    return new Promise((resolve, reject) => {
      this.setInitAxios();
      Axios.post(encodeURI(opt.url), QS.stringify(opt.params || {})).then(
        function (rsp) {
          if (rsp.data != "") {
            rsp.data.netStatus = rsp.status;
          }
          resolve(rsp.data);
        }
      );
    });
  }

  static postJSON(opt) {
    return new Promise((resolve, reject) => {
      this.setInitAxios();

      Axios.post(encodeURI(opt.url), opt.params || {}, {
        headers: opt.headers || {}
      })
        .then(function (rsp) {
          rsp.data.netStatus = rsp.status;
          resolve(rsp.data);
        }).catch(err => {
          reject({
            netStatus: err.response.status,
            status: 0,
            message: err.response.data.error.message ? err.response.data.error.message : "请求超时"
          });
        });
    });
  }

  static postFormData(opt) {
    var formData = new FormData();
    Object.keys(opt.params).forEach((key) => {
      formData.append(key, opt.params[key]);
    });
    return new Promise((resolve, reject) => {
      this.setInitAxios();
      Axios.post(encodeURI(opt.url), formData, {
        headers: opt.headers || {},
        timeout: opt.timeout || 5000,
        responseType: 'blob'
      })
        .then(function (rsp) {
          resolve(rsp);
        }).catch(err => {
          reject({
            netStatus: err.status,
            status: 0,
            message: "请求超时"
          });
        });
    });
  }

  static putJSON(opt) {
    return new Promise((resolve, reject) => {
      this.setInitAxios();

      Axios.put(encodeURI(opt.url), opt.params || {}, {
        headers: opt.headers || {}
      })
        .then(function (rsp) {
          rsp.data.netStatus = rsp.status;
          resolve(rsp.data);
        }).catch(err => {
          reject({
            netStatus: err.response.status,
            status: 0,
            message: err.response.data.error.message ? err.response.data.error.message : "请求超时"
          });
        });
    });
  }

  static putFormData(opt) {
    var formData = new FormData();
    Object.keys(opt.params).forEach((key) => {
      formData.append(key, opt.params[key]);
    });

    return new Promise((resolve, reject) => {
      this.setInitAxios();

      Axios.put(encodeURI(opt.url), formData, {
        headers: opt.headers || {}
      })
        .then(function (rsp) {
          rsp.data.netStatus = rsp.status;
          resolve(rsp.data);
        }).catch(err => {
          reject({
            netStatus: err.status,
            status: 0,
            message: "请求超时"
          });
        });
    });
  }

  static delete(opt) {
    return new Promise((resolve, reject) => {
      this.setInitAxios();

      Axios.delete(encodeURI(opt.url), opt.params || {}, {
        headers: opt.headers || {}
      })
        .then(function (rsp) {
          rsp.data.netStatus = rsp.status;
          resolve(rsp.data);
        }).catch(err => {
          reject({
            netStatus: err.status,
            status: 0,
            message: "请求超时"
          });
        });
    });
  }



  static setInitAxios(timeout) {
    if (this._token !== null) {
      Axios.defaults.headers.common['authorization'] = 'Bearer ' + this._token
    }

    if (!timeout) {
      Axios.defaults.timeout = 5000;
    } else {
      Axios.defaults.timeout = timeout;
    }

    Axios.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    Axios.interceptors.response.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
}