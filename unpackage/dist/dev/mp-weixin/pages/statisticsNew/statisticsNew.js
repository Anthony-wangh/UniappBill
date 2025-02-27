"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_qiunDataCharts_js_sdk_uCharts_uCharts = require("../../uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js");
var uChartsInstance = {};
const _sfc_main = {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cWidth: 750,
      cHeight: 500
    };
  },
  onReady() {
    this.cWidth = common_vendor.index.upx2px(750);
    this.cHeight = common_vendor.index.upx2px(500);
    this.getServerData();
  },
  methods: {
    drawCharts(id, data) {
      const ctx = common_vendor.index.createCanvasContext(id, this);
      uChartsInstance[id] = new uni_modules_qiunDataCharts_js_sdk_uCharts_uCharts.uCharts({
        type: "pie",
        context: ctx,
        width: this.cWidth,
        height: this.cHeight,
        series: this.chartData.series,
        animation: true,
        timing: "easeOut",
        duration: 1e3,
        rotate: false,
        rotateLock: false,
        background: "#FFFFFF",
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [5, 5, 5, 5],
        fontSize: 13,
        fontColor: "#666666",
        dataLabel: true,
        dataPointShape: true,
        dataPointShapeType: "solid",
        touchMoveLimit: 60,
        enableScroll: false,
        enableMarkLine: false,
        legend: {
          show: true,
          position: "bottom",
          float: "center",
          padding: 5,
          margin: 5,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(0,0,0,0)",
          borderWidth: 0,
          fontSize: 13,
          fontColor: "#666666",
          lineHeight: 11,
          hiddenColor: "#CECECE",
          itemGap: 10
        },
        extra: {
          pie: {
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF",
            customRadius: 0,
            linearType: "none"
          },
          tooltip: {
            showBox: true,
            showArrow: true,
            showCategory: true,
            borderWidth: 0,
            borderRadius: 0,
            borderColor: "#000000",
            borderOpacity: 0.7,
            bgColor: "#000000",
            bgOpacity: 0.7,
            gridType: "solid",
            dashLength: 4,
            gridColor: "#CCCCCC",
            boxPadding: 3,
            fontSize: 13,
            lineHeight: 20,
            fontColor: "#FFFFFF",
            legendShow: true,
            legendShape: "auto",
            splitLine: true,
            horizentalLine: false,
            xAxisLabel: false,
            yAxisLabel: false,
            labelBgColor: "#FFFFFF",
            labelBgOpacity: 0.7,
            labelFontColor: "#666666"
          }
        }
      });
    },
    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e);
      uChartsInstance[e.target.id].showToolTip(e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.tap && $options.tap(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-40e74c80"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statisticsNew/statisticsNew.js.map
