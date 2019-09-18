/* eslint-disable */

import Server from "@/core/server";
import {
    services
} from "@/core/services";

export const login = {
    data() {
        return {
            user: {
                ip: "122.193.33.86:8006",
                appid: "SX_KJXX",

                userAccount: "",
                userPwd: "",
                // remember: false
            },
            rules: {
                userAccount: [{
                    required: true,
                    message: "用户名不能为空",
                    trigger: "blur"
                }],
                userPwd: [{
                    required: true,
                    message: "密码不能为空",
                    trigger: "blur"
                }]
            },
            loading: false
        };
    },
    methods: {
        loginSys() {
            this.loading = true;
            Server.post({
                url: services.sys.login,
                params: {
                    username: this.user.userAccount,
                    pwd: this.user.userPwd
                }
            }).then(rsp => {
                if (rsp.status === 1) {
                    this.$Message.success("登录成功");
                    sessionStorage.setItem("userInfo", JSON.stringify(rsp.data.userInfo));

                    // var aaa = JSON.parse(sessionStorage.getItem("userInfo"));
                    // console.log(aaa);
                    
                    this.$router.push({
                        path: `/main/${this.user.ip}/${this.user.appid}`
                    });

                } else {
                    this.$Message.error(rsp.message);
                }
            });

        }
    }
};