"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      budget: 1e3,
      // 默认预算为1000，可以从本地存储中加载
      isEditing: false,
      // 控制是否显示编辑界面
      newBudget: ""
      // 用来保存编辑中的新预算值
    };
  },
  onLoad() {
    const savedBudget = common_vendor.index.getStorageSync("budget");
    if (savedBudget) {
      this.budget = savedBudget;
    }
  },
  methods: {
    // 切换到编辑模式
    editBudget() {
      this.isEditing = true;
      this.newBudget = this.budget;
    },
    // 保存新预算
    saveBudget() {
      const parsedBudget = parseFloat(this.newBudget);
      if (isNaN(parsedBudget) || parsedBudget <= 0) {
        common_vendor.index.showToast({
          title: "请输入有效的数字",
          icon: "none"
        });
        return;
      }
      this.budget = parsedBudget;
      common_vendor.index.setStorageSync("budget", this.budget);
      this.isEditing = false;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isEditing
  }, !$data.isEditing ? {
    b: common_vendor.t($data.budget),
    c: common_vendor.o((...args) => $options.editBudget && $options.editBudget(...args))
  } : {
    d: $data.newBudget,
    e: common_vendor.o(($event) => $data.newBudget = $event.detail.value),
    f: common_vendor.o((...args) => $options.saveBudget && $options.saveBudget(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7fad0a1c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/settings.js.map
