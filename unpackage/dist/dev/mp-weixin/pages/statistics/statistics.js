"use strict";
const common_vendor = require("../../common/vendor.js");
const PieChart = () => "../../components/Chart/PieChart.js";
const _sfc_main = {
  components: {
    PieChart
  },
  data() {
    return {
      chartData: {
        series: [
          {
            data: [
              { name: "一班", value: 256 },
              { name: "二班", value: 123 },
              { name: "三班", value: 20 },
              { name: "四班", value: 0 },
              { name: "五班", value: 0 }
            ]
          }
        ]
      },
      // 用来存储账单数据
      bills: [],
      categories: [
        {
          name: "购物",
          color: "#ff6b6b",
          type: "expense"
        },
        {
          name: "餐饮",
          color: "#48dbfb",
          type: "expense"
        },
        {
          name: "交通",
          color: "#f368e0",
          type: "expense"
        },
        { name: "房屋", color: "#eb3b5a", type: "expense" },
        { name: "工资", color: "#1dd1a1", type: "income" }
      ],
      currentDate: /* @__PURE__ */ new Date()
    };
  },
  onShow() {
    this.loadBills();
    this.$refs.pieChart.drawCharts(this.chartData);
  },
  computed: {
    currentMonth() {
      return this.currentDate.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
    }
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
      const grouped = [];
      this.categories.forEach((category) => {
        const sery = {};
        sery.name = category.name;
        const v = filteredBills.filter((item) => item.category === category.name).reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
        sery.value = Number(v);
        grouped.push(sery);
      });
      var templateData = {};
      const seriesItem = {};
      seriesItem.data = grouped;
      templateData.series = [seriesItem];
      this.chartData = templateData;
    },
    changeMonth(offset) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      this.currentDate = newDate;
      this.filterBillsByMonth();
    }
  }
};
if (!Array) {
  const _component_PieChart = common_vendor.resolveComponent("PieChart");
  _component_PieChart();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.changeMonth(-1)),
    b: common_vendor.t($options.currentMonth),
    c: common_vendor.o(($event) => $options.changeMonth(1)),
    d: common_vendor.sr("pieChart", "380879e3-0"),
    e: common_vendor.p({
      chartData: $data.chartData
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/statistics.js.map
