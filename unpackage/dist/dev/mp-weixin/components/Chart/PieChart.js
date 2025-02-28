"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_qiunDataCharts_js_sdk_uCharts_uCharts = require("../../uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js");
var uChartsInstance = {};
const _sfc_main = {
  props: {
    chartData: {
      type: Object,
      required: true
    },
    canvasId: {
      type: String,
      default: "ArBwWAWJdkXMBnJcQJJNACsjnSNbpxaM"
    }
  },
  data() {
    return {
      cWidth: 750,
      cHeight: 500
    };
  },
  methods: {
    drawCharts(data) {
      const ctx = common_vendor.index.createCanvasContext(this.canvasId, this);
      uChartsInstance[this.canvasId] = new uni_modules_qiunDataCharts_js_sdk_uCharts_uCharts.uCharts({
        type: "pie",
        context: ctx,
        width: common_vendor.index.upx2px(750),
        height: common_vendor.index.upx2px(500),
        series: data.series,
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
      const chart = uChartsInstance[this.canvasId];
      chart.touchLegend(e);
      chart.showToolTip(e);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.canvasId,
    b: $props.canvasId,
    c: common_vendor.o((...args) => $options.tap && $options.tap(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ebc50cd4"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/Chart/PieChart.js.map
