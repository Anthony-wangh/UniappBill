"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      bills: [],
      categories: [
        { name: "购物", color: "#ff6b6b", type: "expense" },
        { name: "餐饮", color: "#48dbfb", type: "expense" },
        { name: "交通", color: "#f368e0", type: "expense" },
        { name: "娱乐", color: "#ff9f1c", type: "expense" },
        { name: "房屋", color: "#eb3b5a", type: "expense" },
        { name: "工资", color: "#1dd1a1", type: "income" },
        { name: "奖金", color: "#2ecc71", type: "income" }
      ],
      totalIncome: 0,
      totalExpense: 0,
      currentDate: /* @__PURE__ */ new Date(),
      groupedBills: {},
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      budget: common_vendor.index.getStorageSync("budget") || 0
      // 从设置中获取月度预算
    };
  },
  computed: {
    currentMonth() {
      return this.currentDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
    },
    balance() {
      return Number(this.budget) + Number(this.totalIncome) - Number(this.totalExpense);
    }
  },
  onShow() {
    this.loadBills();
    this.budget = common_vendor.index.getStorageSync("budget") || 0;
  },
  methods: {
    loadBills() {
      const bills = common_vendor.index.getStorageSync("bills") || [];
      this.bills = bills;
      this.filterBillsByMonth();
    },
    filterBillsByMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const filteredBills = this.bills.filter((bill) => {
        const billDate = new Date(bill.time);
        return billDate.getFullYear() === year && billDate.getMonth() === month;
      });
      this.totalPages = Math.ceil(filteredBills.length / this.pageSize);
      this.groupBillsByDate(filteredBills.slice(0, this.pageSize * this.currentPage));
      this.calculateTotal(filteredBills);
    },
    groupBillsByDate(bills) {
      const grouped = {};
      bills.forEach((bill) => {
        const date = new Date(bill.time).toLocaleDateString();
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(bill);
      });
      this.groupedBills = grouped;
    },
    calculateTotal(bills) {
      this.totalIncome = bills.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
      this.totalExpense = bills.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
    },
    changeMonth(offset) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      this.currentDate = newDate;
      this.filterBillsByMonth();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    getCategoryColor(categoryName) {
      const category = this.categories.find((c) => c.name === categoryName);
      return category ? category.color : "#cccccc";
    },
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: `/pages/${page}/${page}`
      });
    }
  }
};
if (!Array) {
  const _easycom_IconButton2 = common_vendor.resolveComponent("IconButton");
  _easycom_IconButton2();
}
const _easycom_IconButton = () => "../../components/IconButton/IconButton.js";
if (!Math) {
  _easycom_IconButton();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.changeMonth(-1)),
    b: common_vendor.t($options.currentMonth),
    c: common_vendor.o(($event) => $options.changeMonth(1)),
    d: common_vendor.t($data.totalIncome),
    e: common_vendor.t($data.totalExpense),
    f: common_vendor.t($data.budget),
    g: common_vendor.t($options.balance),
    h: common_vendor.n({
      "positive": $options.balance >= 0,
      "negative": $options.balance < 0
    }),
    i: Object.keys($data.groupedBills).length === 0
  }, Object.keys($data.groupedBills).length === 0 ? {} : {}, {
    j: common_vendor.f($data.groupedBills, (group, date, i0) => {
      return {
        a: common_vendor.t($options.formatDate(date)),
        b: common_vendor.f(group, (item, index, i1) => {
          return common_vendor.e({
            a: $options.getCategoryColor(item.category),
            b: common_vendor.t(item.category),
            c: item.remark
          }, item.remark ? {
            d: common_vendor.t(item.remark)
          } : {}, {
            e: common_vendor.t(item.type === "income" ? "+" : "-"),
            f: common_vendor.t(item.amount),
            g: common_vendor.n(item.type === "income" ? "income" : "expense"),
            h: index
          });
        }),
        c: date
      };
    }),
    k: common_vendor.o(($event) => $options.navigateTo("addBill")),
    l: common_vendor.o(($event) => $options.navigateTo("statistics")),
    m: common_vendor.p({
      iconSrc: "/static/statiscs.png",
      label: "统计"
    }),
    n: common_vendor.o(($event) => $options.navigateTo("settings")),
    o: common_vendor.p({
      iconSrc: "/static/setting.png",
      label: "设置"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/bills/bills.js.map
