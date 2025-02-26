"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../uni_modules/lime-echart/static/echarts.min");
const _sfc_main = {
  data() {
    return {
      bills: [],
      // 用来存储账单数据
      categories: [
        { name: "购物", color: "#ff6b6b", type: "expense" },
        { name: "餐饮", color: "#48dbfb", type: "expense" },
        { name: "交通", color: "#f368e0", type: "expense" },
        { name: "娱乐", color: "#ff9f1c", type: "expense" },
        { name: "房屋", color: "#eb3b5a", type: "expense" },
        { name: "工资", color: "#1dd1a1", type: "income" },
        { name: "奖金", color: "#2ecc71", type: "income" }
      ],
      viewType: "monthly",
      // 默认显示当月统计
      currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
      years: [],
      // 存储可选择的年份
      pieChartInstance: null,
      barChartInstance: null
    };
  },
  mounted() {
  },
  methods: {
    init() {
      this.loadEcharts();
      this.loadBills();
      this.initYears();
    },
    loadEcharts() {
      if (this.viewType === "monthly") {
        this.drawPieChart();
      } else {
        this.drawBarChart();
      }
    },
    loadBills() {
      const storedBills = common_vendor.index.getStorageSync("bills") || [];
      this.bills = storedBills;
    },
    initYears() {
      const minYear = Math.min(...this.bills.map((bill) => new Date(bill.date).getFullYear()));
      const maxYear = (/* @__PURE__ */ new Date()).getFullYear();
      for (let year = minYear; year <= maxYear; year++) {
        this.years.push(year);
      }
    },
    setViewType(type) {
      this.viewType = type;
      if (type === "monthly") {
        this.drawPieChart();
      } else if (type === "yearly") {
        this.drawBarChart();
      }
    },
    onYearChange(e) {
      this.currentYear = this.years[e.detail.value];
      this.drawBarChart();
    },
    drawPieChart() {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select("#pieChart").fields({ node: true, size: true }).exec((res) => {
        if (res[0] && res[0].node) {
          const canvas = res[0].node;
          canvas.getContext("2d");
          const width = res[0].width;
          const height = res[0].height;
          if (this.pieChartInstance) {
            this.pieChartInstance.dispose();
          }
          this.pieChartInstance = this.$refs.chart(canvas, null, {
            width,
            height,
            devicePixelRatio: common_vendor.index.getSystemInfoSync().pixelRatio
          });
          this.updatePieChart();
        }
      });
    },
    updatePieChart() {
      const option = {
        title: {
          text: "当月账单分类统计",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "金额",
            type: "pie",
            radius: "50%",
            data: this.monthlyData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.pieChartInstance.setOption(option);
    },
    drawBarChart() {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select("#barChart").fields({ node: true, size: true }).exec((res) => {
        if (res[0] && res[0].node) {
          const canvas = res[0].node;
          canvas.getContext("2d");
          const width = res[0].width;
          const height = res[0].height;
          if (this.barChartInstance) {
            this.barChartInstance.dispose();
          }
          this.barChartInstance = this.$refs.chart.init(canvas, null, {
            width,
            height,
            devicePixelRatio: common_vendor.index.getSystemInfoSync().pixelRatio
          });
          this.updateBarChart();
        }
      });
    },
    updateBarChart() {
      const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      const data = this.yearlyData;
      const option = {
        title: {
          text: `${this.currentYear}年每月收支统计`,
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["收入", "支出"],
          top: "10%"
        },
        xAxis: {
          type: "category",
          data: months
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "收入",
            type: "bar",
            stack: "total",
            label: {
              show: true
            },
            emphasis: {
              focus: "series"
            },
            data: data.map((item) => item.income)
          },
          {
            name: "支出",
            type: "bar",
            stack: "total",
            label: {
              show: true
            },
            emphasis: {
              focus: "series"
            },
            data: data.map((item) => item.expense)
          }
        ]
      };
      this.barChartInstance.setOption(option);
    }
  },
  computed: {
    monthlyData() {
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      const month = (/* @__PURE__ */ new Date()).getMonth();
      const filteredBills = this.bills.filter((bill) => {
        const billDate = new Date(bill.date);
        return billDate.getFullYear() === year && billDate.getMonth() === month;
      });
      const categoryTotals = {};
      filteredBills.forEach((bill) => {
        if (!categoryTotals[bill.category]) {
          categoryTotals[bill.category] = 0;
        }
        categoryTotals[bill.category] += Number(bill.amount);
      });
      return Object.keys(categoryTotals).map((category) => ({
        name: category,
        value: categoryTotals[category]
      }));
    },
    yearlyData() {
      const year = this.currentYear;
      const filteredBills = this.bills.filter((bill) => {
        const billDate = new Date(bill.date);
        return billDate.getFullYear() === year;
      });
      const monthlyTotals = Array(12).fill({ income: 0, expense: 0 });
      filteredBills.forEach((bill) => {
        const monthIndex = new Date(bill.date).getMonth();
        if (Number(bill.amount) > 0) {
          monthlyTotals[monthIndex].income += Number(bill.amount);
        } else {
          monthlyTotals[monthIndex].expense -= Number(bill.amount);
        }
      });
      return monthlyTotals.map((total, index) => ({
        month: index + 1,
        income: total.income,
        expense: total.expense
      }));
    }
  }
};
if (!Array) {
  const _easycom_l_echart2 = common_vendor.resolveComponent("l-echart");
  _easycom_l_echart2();
}
const _easycom_l_echart = () => "../../uni_modules/lime-echart/components/l-echart/l-echart.js";
if (!Math) {
  _easycom_l_echart();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("chartRef", "fc23ec97-0"),
    b: common_vendor.o($options.init)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fc23ec97"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/statistics.js.map
