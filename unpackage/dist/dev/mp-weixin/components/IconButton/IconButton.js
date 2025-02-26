"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    iconSrc: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.iconSrc,
    b: common_vendor.t($props.label),
    c: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-535b2a1c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/IconButton/IconButton.js.map
