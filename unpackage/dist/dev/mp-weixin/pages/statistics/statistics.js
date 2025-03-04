"use strict";
const common_vendor = require("../../common/vendor.js");
const PieChart = () => "../../components/Chart/PieChart.js";
const ColumnChart = () => "../../components/Chart/ColumnChart.js";
const _sfc_main = {
  components: {
    PieChart,
    ColumnChart
  },
  data() {
    return {
      columnChartData: {
        categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
        series: [
          {
            name: "目标值",
            data: [35, 36, 31, 33, 13, 34]
          },
          {
            name: "完成量",
            data: [18, 27, 21, 24, 6, 28]
          }
        ]
      },
      groupBills: [],
      chartData: {
        series: [
          {
            data: [
              {
                name: "一班",
                value: 256
              },
              {
                name: "二班",
                value: 123
              },
              {
                name: "三班",
                value: 20
              },
              {
                name: "四班",
                value: 0
              },
              {
                name: "五班",
                value: 0
              }
            ]
          }
        ]
      },
      // 用来存储账单数据
      bills: [],
      billsInCurrentMouth: [],
      categories: [
        {
          name: "购物",
          color: "#ff6b6b",
          type: "expense",
          icon: "Groceries"
        },
        {
          name: "餐饮",
          color: "#48dbfb",
          type: "expense",
          icon: "Restaurant"
        },
        {
          name: "交通",
          color: "#f368e0",
          type: "expense",
          icon: "Transportation"
        },
        {
          name: "娱乐",
          color: "#ff9f1c",
          type: "expense",
          icon: "Party"
        },
        {
          name: "健康",
          color: "#eb3b5a",
          type: "expense",
          icon: "Health"
        },
        {
          name: "电子",
          color: "#f368e0",
          type: "expense",
          icon: "Electronics"
        },
        {
          name: "礼物",
          color: "#ff9f1c",
          type: "expense",
          icon: "Electronics"
        },
        {
          name: "起居",
          color: "#eb3b5a",
          type: "expense",
          icon: "Institute"
        }
      ],
      currentDate: /* @__PURE__ */ new Date()
    };
  },
  onShow() {
    this.loadBills();
    this.update();
  },
  computed: {
    currentMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      return `${year}年${month}月`;
    }
  },
  methods: {
    update() {
      var _a, _b;
      this.filterBillsByMonth();
      this.updatePieChart();
      this.updateColumnChart();
      (_a = this.$refs.pieChart) == null ? void 0 : _a.drawCharts(this.chartData);
      (_b = this.$refs.columnChart) == null ? void 0 : _b.drawCharts(this.columnChartData);
    },
    loadBills() {
      const bills = common_vendor.index.getStorageSync("bills") || [];
      this.bills = bills;
    },
    filterBillsByMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      this.billsInCurrentMouth = this.bills.filter((bill) => {
        const billDate = new Date(bill.time);
        return billDate.getFullYear() === year && billDate.getMonth() === month;
      });
    },
    updatePieChart() {
      const grouped = [];
      this.categories.forEach((category) => {
        const sery = {};
        sery.name = category.name;
        const v = this.billsInCurrentMouth.filter((item) => item.category === category.name).reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
        sery.value = Number(v);
        if (sery.value > 0) {
          grouped.push(sery);
        }
      });
      var templateData = {};
      const seriesItem = {};
      seriesItem.data = grouped;
      templateData.series = [seriesItem];
      this.chartData = templateData;
      this.groupBills = grouped.sort((a, b) => b.value - a.value);
    },
    updateColumnChart() {
      const groupedExpense = {};
      const groupedIncome = {};
      const days = [];
      this.billsInCurrentMouth.forEach((bill) => {
        const date = new Date(bill.time).getDay().toString();
        if (bill.type === "expense") {
          if (!groupedExpense[date]) {
            groupedExpense[date] = 0;
            if (days.findIndex((c) => c === date) === -1)
              days.push(date);
          }
          groupedExpense[date] = groupedExpense[date] + Number(bill.amount);
        } else {
          if (!groupedIncome[date]) {
            groupedIncome[date] = 0;
            if (days.findIndex((c) => c === date) === -1)
              days.push(date);
          }
          groupedIncome[date] = groupedIncome[date] + Number(bill.amount);
        }
      });
      const incomeList = [];
      const expenseList = [];
      days.forEach((day) => {
        if (groupedIncome[day])
          incomeList.push(groupedIncome[day]);
        else
          incomeList.push(0);
        if (groupedExpense[day])
          expenseList.push(groupedExpense[day]);
        else
          expenseList.push(0);
      });
      var templateData = {};
      const seriesItem1 = {
        name: "支出",
        data: expenseList
      };
      const seriesItem2 = {
        name: "收入",
        data: incomeList
      };
      templateData.categories = days;
      templateData.series = [seriesItem1, seriesItem2];
      this.columnChartData = templateData;
    },
    changeMonth(offset) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      this.currentDate = newDate;
      this.update();
    },
    getCategoryColor(categoryName) {
      const category = this.categories.find((c) => c.name === categoryName);
      return `/static/typeIcons/${category ? category.icon : "Maintenance"}.png`;
    }
  }
};
if (!Array) {
  const _component_PieChart = common_vendor.resolveComponent("PieChart");
  const _component_ColumnChart = common_vendor.resolveComponent("ColumnChart");
  (_component_PieChart + _component_ColumnChart)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.changeMonth(-1)),
    b: common_vendor.t($options.currentMonth),
    c: common_vendor.o(($event) => $options.changeMonth(1)),
    d: Object.keys($data.groupBills).length === 0
  }, Object.keys($data.groupBills).length === 0 ? {} : {}, {
    e: common_vendor.sr("pieChart", "380879e3-0"),
    f: common_vendor.p({
      canvasId: "PieChartCanvas"
    }),
    g: common_vendor.f($data.groupBills, (item, index, i0) => {
      return {
        a: $options.getCategoryColor(item.name),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.value.toString()),
        d: index
      };
    }),
    h: common_vendor.sr("columnChart", "380879e3-1"),
    i: common_vendor.p({
      canvasId: "ColumnChart"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/statistics.js.map
