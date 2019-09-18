/* eslint-disable */

import Server from "@/core/server";
import {
    services
} from "@/core/services";
export const login = {
    data() {
        return {
            user: {
                ip: "",
                appid: "",
                // eslint-disable-next-line
                userAccount: "",
                // eslint-disable-next-line
                userPwd: "",
                remember: false
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
        checkLogin() {
            this.loading = true;
            Server.post({
                url: `http://${this.user.ip}/onemapsrv/admin/Login/`,
                params: {
                    params: JSON.stringify({
                        appid: this.user.appid,
                        userAccount: this.user.userAccount,
                        password: this.user.userPwd
                    })
                }
            }).then(rsp => {
                if (rsp.status === 1) {
                    this.$Message.success("登录成功");
                    sessionStorage.setItem("userInfo", JSON.stringify(this.user));
                    this.$router.push({
                        path: `/main/${this.user.ip}/${this.user.appid}`
                    });

                    let autocompleteIPs = localStorage["autocompleteIPs"];
                    if (!autocompleteIPs) {
                        autocompleteIPs = "[]";
                    }
                    let ips = JSON.parse(autocompleteIPs);
                    if (ips.includes(this.user.ip) === false) {
                        ips.push(this.user.ip);
                        localStorage["autocompleteIPs"] = JSON.stringify(ips);
                    }
                } else {
                    this.$Message.error(rsp.message);
                }
            });

        }
    }
};