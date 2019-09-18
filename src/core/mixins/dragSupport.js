/*默认的TreeView+Table的节点拖拽功能扩展
使用方法：
1.Table设置row-class-name为rowClass、建议将修改按钮的事件同时绑定到on-row-dblclick，因为启用了拖拽之后，
2.TreeView的自定义渲染函数传入对象       
        {
          dragover: this.layerDragover,
          drop: this.layerDrop,
          dragend: this.layerDragend,
          save:this.onSaveDrag
        }
3.loadTable更新数据对象后，在nextTick中执行bindTableDrag函数，传入表格数据和保存拖拽的函数
4.引入样式文件/assets/css/drag.less
5.建议table监听排序事件，并使用sortType记录当前的排序顺序，以便提示用户进行正确的拖拽排序，详见layerDragstart
*/
export default {
    methods: {
        //Table中的行加上类drop-target，以便后续查找元素并绑定事件等
        rowClass() {
            return "drop-target";
        },
        //计算悬停位置，分为上中下三部分，中间默认6px
        calcDragPosition(height, y, type) {
            // console.log(height);
            console.log(type);
            if (type == 'tr') {
                let middle = height / 2;
                if (y > middle + 3) {
                    return "down";
                } else if (y < middle - 3) {
                    return "up";
                } else {
                    return "mid";
                }
            } else {
                let three = height / 3;
                if (y > three * 2) {
                    return "down";
                } else if (y < three) {
                    return "up";
                } else {
                    return "mid";
                }
            }
        },
        //iView的Table渲染时无法绑定draggable属性和相关事件，需要使用原始的DOM方式进行处理
        bindTableDrag(data, saveDrag) {
            let rows = document.querySelectorAll("tr.drop-target");
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                row.setAttribute("draggable", true);
                row.setAttribute("data-id", data[i].id);
                row.addEventListener(
                    "dragstart",
                    function (ev) {
                        this.dragStart = true;
                        this.layerDragstart(ev, data[i]);
                    }.bind(this)
                );
                row.addEventListener(
                    "dragend",
                    function (ev) {
                        this.dragStart = false;
                        this.layerDragend();
                    }.bind(this)
                );
                row.addEventListener(
                    "dragover",
                    function (ev) {
                        ev.preventDefault();
                        this.layerDragover(ev, "tr");
                    }.bind(this)
                );
                row.addEventListener(
                    "drop",
                    function (ev) {
                        ev.preventDefault();
                        this.layerDrop(ev, data[i], saveDrag, "tr");
                    }.bind(this)
                );
                row.addEventListener(
                    "dragleave",
                    function (ev) {
                        ev.preventDefault();
                        let el;
                        for (let i = 0; i < ev.path.length; i++) {
                            if (ev.path[i].tagName === "TR") {
                                el = ev.path[i];
                                break;
                            }
                        }
                        if (el) {
                            el.classList.remove("drag-up-tr");
                            el.classList.remove("drag-down-tr");
                            el.classList.remove("drag-mid-tr");
                        }
                    }.bind(this)
                );
            }
        },
        //源目标开始拖放事件，设置dataTransfer的DataId键
        layerDragstart(ev, data) {
            //sortType不为空且不为normal时，说明表格发生了某一列的排序，此时需要对用户进行提示，因为拖拽本质上是根据order字段进行的，而不是表格的显示顺序
            if (this.sortType && this.sortType != "normal") {
                this.$Message.warning("检测到表格进行了排序，请确保在排序字段正序排序时进行拖拽");
            }
            ev.dataTransfer.setData("SrcData", JSON.stringify(data));
        },
        //源目标拖放结束事件，清空所有样式
        layerDragend() {
            // this.dragStart = false;
            this.clearDragClass("li");
            this.clearDragClass("tr");
        },
        //目标对象的dragover事件处理函数，ev是事件对象，type是tr【表格】或li【树】，下同
        layerDragover(ev, type) {
            let el;
            for (let i = 0; i < ev.path.length; i++) {
                if (
                    ev.path[i].classList &&
                    ev.path[i].classList.contains("drop-target")
                ) {
                    el = ev.path[i];
                    break;
                }
            }
            let downClass = `drag-down-${type.toLowerCase()}`;
            let upClass = `drag-up-${type.toLowerCase()}`;
            let midClass = `drag-mid-${type.toLowerCase()}`;
            let oldDown = document.getElementsByClassName(downClass)[0];
            let oldUp = document.getElementsByClassName(upClass)[0];
            let oldMid = document.getElementsByClassName(midClass)[0];
            let position = this.calcDragPosition(type.toLowerCase() == "tr" ? ev.target.offsetHeight : el.offsetHeight, ev.offsetY, type);
            // let position = this.calcDragPosition(el.offsetHeight, ev.offsetY, type);
            if (
                (position === "up" && oldUp == el) ||
                (position === "mid" && oldMid == el) ||
                (position === "down" && oldDown == el)
            ) {
                return;
            }
            this.layerDragend();
            switch (position) {
                case "up":
                    {
                        el.classList.add(upClass);
                        break;
                    }
                case "down":
                    {
                        el.classList.add(downClass);
                        break;
                    }
                case "mid":
                    {
                        el.classList.add(midClass);
                        break;
                    }
            }
        },
        clearDragClass(type) {
            let arr = ["down", "up", "mid"];
            arr.forEach(item => {
                let dragClass = `drag-${item}-${type.toLowerCase()}`;
                let items = document.getElementsByClassName(dragClass);
                if (items && items.length > 0) {
                    for (let i = 0; i < items.length; i++) {
                        items[i].classList.remove(dragClass);
                    }
                }
            });
        },
        //拖放释放事件
        layerDrop(ev, target, saveDrag, type) {
            if (!ev.dataTransfer.getData("SrcData")) {
                return;
            }
            let el;
            for (let i = 0; i < ev.path.length; i++) {
                if (
                    ev.path[i].classList &&
                    ev.path[i].classList.contains("drop-target")
                ) {
                    el = ev.path[i];
                    break;
                }
            }
            if (el) {
                let position = this.calcDragPosition(type.toLowerCase() == "tr" ? ev.target.offsetHeight : el.offsetHeight, ev.offsetY, type);
                // let position = this.calcDragPosition(el.offsetHeight, ev.offsetY, type);
                saveDrag(
                    JSON.parse(ev.dataTransfer.getData("SrcData")),
                    target,
                    position
                );
            }
        },
        //使用默认规则，根据源、目标数据和上中下位置，获得数据id、目标父节点和目标顺序值，要求数据的id、父数据id和顺序的字段键分别是id、pid和order
        defaultDragResultCalc(src, target, position) {
            if (src.id === target.id) {
                return null;
            }
            let id = src.id;
            let pid = target.pid;
            let newOrder = target.order;
            if (position === "mid") {
                newOrder = 0;
                pid = target.id;
            } else {
                if (src.pid == target.pid) {
                    //同级调序
                    if (src.order < target.order) {
                        if (position === "up") {
                            newOrder--;
                        } else {
                            // newOrder++;
                        }
                    } else if (src.order == target.order) {
                        return;
                    } else {
                        if (position === "up") {
                            // newOrder--;
                        } else {
                            newOrder++;
                        }
                    }
                } else {
                    //跨父节点调序
                    if (position === "up") {
                        // newOrder--;
                    } else {
                        newOrder++;
                    }
                }
            }
            if (!pid || isNaN(newOrder)) {
                return null;
            }
            return {
                id: id,
                targetPid: pid,
                targetOrder: newOrder
            };
        }
    }
};