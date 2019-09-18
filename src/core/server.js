import Axios from "axios";
import QS from "qs";
import {
  debug
} from "util";
export default class Server {
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

  static setInitAxios(timeout) {
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