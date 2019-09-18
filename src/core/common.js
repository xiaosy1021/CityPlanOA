import Vue from 'vue';

export const commonHelper = {
    padLeftZero(str) {
        return ("00" + str).substr(str.length);
    },
    formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        let o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + "";
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? str : this.padLeftZero(str)
                );
            }
        }
        return fmt;
    }
};

export const renderHelper = {
    //渲染一个span,内容为[yyyy-MM-dd hh:mm]格式的时间
    renderDateTimeForTable(h, time) {
        return h("span", commonHelper.formatDate(
            new Date(time),
            "yyyy-MM-dd hh:mm"
        ));
    },
    //渲染一个Tag,flag为true时是绿色，否则是灰色
    renderTagForTable(h, flag) {
        return h("Tag", {
            props: {
                color: flag === true ? "success" : "gray",
                type: "dot"
            }
        });
    },
    //渲染一个操作按钮,可制定点击事件、标题、图标
    renderSingleButtonForTable(h, params, func, title, icon) {
        return h("div", [
            h("i-button", {
                props: {
                    shape: "circle",
                    icon: icon
                },
                domProps: {
                    title: title
                },
                style: {
                    marginRight: "5px"
                },
                on: {
                    click: () => {
                        func(params.row, params.index);
                    }
                }
            })
        ]);
    },
    //渲染一个配置按钮
    renderConfigButtonForTable(h, params, func) {
        return this.renderSingleButtonForTable(h, params, func, "配置", "md-build");
    },
    //渲染一个绑定按钮
    renderBindButtonForTable(h, params, func) {
        return this.renderSingleButtonForTable(h, params, func, "绑定", "ios-lock");
    },
    //渲染一个跳转按钮
    renderActionButtonForTable(h, params, func) {
        return this.renderSingleButtonForTable(h, params, func, "跳转", "md-share-alt");
    },
    //渲染默认的操作按钮，修改+删除
    renderDefaultOpterForTable(h, params, editFunc, removeFunc) {
        return h("div", [
            h("i-button", {
                props: {
                    shape: "circle",
                    icon: "ios-create"

                },
                domProps: {
                    title: "修改"
                },
                style: {
                    marginRight: "5px"
                },
                on: {
                    click: () => {
                        editFunc(params.row, params.index);
                    }
                }
            }),
            h("i-button", {
                props: {
                    shape: "circle",
                    icon: "ios-trash"
                },
                domProps: {
                    title: "删除"
                },
                style: {
                    cursor: "pointer"
                },
                on: {
                    click: () => {
                        removeFunc(params.row, params.index);
                    }
                }
            })
        ]);
    },
    //通过类控制树节点的选中效果
    clearNodeSelected(treeRef) {
        let nodes = treeRef.$el.querySelectorAll(".node-text");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].className = "node-text";
        }
    },
    //在树结构中查找特定值的节点，找到时，返回true，并且使其isSelected属性为true，并将其所有父节点展开，默认比对id属性，可指定属性
    findNodeChildren(node, key, options = {}) {
        let keyProp = options.keyProp || "id";
        let expandSelf = options.expandSelf || false;
        if (node[keyProp] === key) {
            if (expandSelf === true) {
                node.expand = true;
            }
            node.isSelected = true;
            return true;
        } else {
            if (node.children && node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    let result = this.findNodeChildren(node.children[i], key, options);
                    if (result === true) {
                        node.expand = true;
                        return true;
                    } else {
                        continue;
                    }
                }
            }
        }
    },
    //渲染默认的自定义树节点
    renderDefaultNodeForTree(h, {
        root,
        node,
        data
    }, nodeClick, treeRef, icon, draggable) {
        return h(
            "span", {
                domProps: {

                    className: draggable ? "drop-target" : "",
                    draggable: (draggable && data.id != "0") ? true : false
                },
                attrs: {
                    "data-id": data.id,
                },
                style: {
                    display: "inline-block",
                    width: "100%",
                    fontSize: "14px",
                    cursor: "pointer"
                },
                on: {
                    click: e => {
                        // this.clearNodeSelected(treeRef);
                        // e.path[1].querySelectorAll(".node-text")[0].className =
                        //     "node-text selected";
                        for (let i = 0; i < root.length; i++) {
                            //TODO 由于Vue.set会触发渲染，需要考虑性能问题。如果渲染出现较慢的情况，仍需使用更改类名的方式，可减少渲染次数
                            Vue.set(root[i].node, "isSelected", false);
                            //root[i].node.isSelected = false;
                        }
                        Vue.set(data, "isSelected", true);
                        // Vue.set(data,"expand",true);
                        nodeClick(data);
                    },
                    dragstart: ev => {
                        ev.dataTransfer.setData("SrcData", JSON.stringify(data));
                    },
                    dragover: ev => {
                        if (draggable && draggable.dragover) {
                            ev.preventDefault();
                            draggable.dragover(ev, "li");
                        }
                    },
                    drop: ev => {
                        if (draggable && draggable.drop && draggable.save) {
                            ev.preventDefault();
                            draggable.drop(ev, data, draggable.save, "li");
                        }
                    },
                    dragend: ev => {
                        if (draggable && draggable.drop) {
                            draggable.dragend();
                        }
                    },
                    dragleave: ev => {}
                }
            },
            [
                h("span", [
                    h("Icon", {
                        props: {
                            type: icon || "ios-paper-outline",
                            size: "18"
                        },
                        style: {
                            marginRight: "8px"
                        }
                    }),
                    h(
                        "span", {
                            domProps: {
                                className: data.isSelected === true ?
                                    "node-text selected" : "node-text"
                            }
                        },
                        data.title
                    )
                ])
            ]
        );
    },
}