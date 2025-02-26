"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      bill: {
        date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        // 默认当前日期
        amount: "",
        type: "",
        // 支出或收入
        category: "",
        // 具体类目
        remark: ""
      },
      types: ["支出", "收入"],
      categories: {
        支出: ["购物", "餐饮", "交通", "娱乐", "房屋"],
        收入: ["工资", "奖金"]
      },
      selectCategories: []
    };
  },
  methods: {
    onDateChange(e) {
      this.bill.date = e.detail.value;
    },
    validateAmount(e) {
      const value = e.detail.value;
      if (!/^\d*\.?\d*$/.test(value)) {
        this.bill.amount = value.replace(/[^0-9.]/g, "");
      }
    },
    onTypeChange(e) {
      const index = e.detail.value;
      this.bill.type = this.types[index];
      this.bill.category = this.categories[this.bill.type][0];
      this.selectCategories = this.categories[this.bill.type];
    },
    onCategoryChange(e) {
      const selectedCategories = this.categories[this.bill.type];
      const index = e.detail.value;
      this.bill.category = selectedCategories[index];
    },
    submitBill() {
      if (!this.bill.amount || !this.bill.type || !this.bill.category) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      let bills = common_vendor.index.getStorageSync("bills") || [];
      bills.push({
        time: new Date(this.bill.date).getTime(),
        amount: parseFloat(this.bill.amount),
        type: this.bill.type,
        category: this.bill.category,
        remark: this.bill.remark
      });
      common_vendor.index.setStorageSync("bills", bills);
      this.bill = {
        date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        amount: "",
        type: "",
        category: "",
        remark: ""
      };
      common_vendor.index.showToast({
        title: "账单添加成功",
        icon: "success"
      });
      this.$emit("navigateTo", "bills");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.bill.date || "请选择日期"),
    b: $data.bill.date,
    c: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    d: common_vendor.o([($event) => $data.bill.amount = $event.detail.value, (...args) => $options.validateAmount && $options.validateAmount(...args)]),
    e: $data.bill.amount,
    f: common_vendor.t($data.bill.type || "请选择类型"),
    g: $data.types,
    h: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args)),
    i: common_vendor.t($data.bill.category || "请选择类目"),
    j: $data.selectCategories,
    k: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    l: $data.bill.remark,
    m: common_vendor.o(($event) => $data.bill.remark = $event.detail.value),
    n: common_vendor.o((...args) => $options.submitBill && $options.submitBill(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/addBill/addBill.js.map
