export default class TreeStore {
  constructor(data, changes = {}) {

    this.treeData = data;
    //设置初始化状态
    this.renderTree(changes);
  }

  expandAll() {
    this.renderTree({
      expand: true
    });
  }
  collpseAll() {
    this.renderTree({
      expand: false
    });
  }
  checkedAll() {
    this.renderTree({
      checked: true
    });
  }
  unCheckedAll() {
    this.renderTree({
      checked: false
    });
  }

  renderTree(changes = {}) {
    this.treeData.forEach(menu => {
      for (var key in changes) {
        menu[key] = changes[key];
      }
      this.renderData(menu, changes);
    });
  }

  renderData(menu, changes = {}) { //遍历子节点的
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(menu => {
        for (var key in changes) {
          menu[key] = changes[key];
        }
        this.renderData(menu, changes);
      });
      menu.checked = false;
    }
  }

  getCheckedNodes(e) {
    return e.filter(item => {
      return item.node.checked || item.node.indeterminate;
    });
  }
}