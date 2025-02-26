<template>
  <view class="icon-button" @click="handleClick">
    <image :src="iconSrc" class="icon"></image>
    <text class="label">{{ label }}</text>
  </view>
</template>

<script>
export default {
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
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
.icon-button {
  display: grid;
  align-items: center;
  justify-content: center;
  background-color: transparent; /* 去掉背景色 */
  border: none; /* 去掉边框 */
  padding: 10px; /* 根据需要调整内边距 */
}

.icon {
  width: 24px; /* 图标宽度 */
  height: 24px; /* 图标高度 */
  margin-right: 5px; /* 图标与文字之间的间距 */
}

.label {
  font-size: 14px; /* 文字大小 */
  color: #333; /* 文字颜色 */
}
</style>