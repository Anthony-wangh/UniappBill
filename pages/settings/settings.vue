<template>
  <view class="container">
    <!-- 显示预算数字或编辑界面 -->
    <view v-if="!isEditing" class="budget-display">
      <text class="budget-text">当前预算: {{ budget }} 元</text>
      <button @click="editBudget" class="edit-button">编辑</button>
    </view>

    <!-- 编辑模式 -->
    <view v-else class="budget-edit">
      <input 
        v-model="newBudget" 
        type="number" 
        placeholder="请输入预算"
        class="budget-input" 
        value="newBudget"
        step="0.01"
        min="0"
      />
      <button @click="saveBudget" class="save-button">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      budget: 1000, // 默认预算为1000，可以从本地存储中加载
      isEditing: false, // 控制是否显示编辑界面
      newBudget: '', // 用来保存编辑中的新预算值
    };
  },
  onLoad() {
    // 尝试从本地存储中加载预算
    const savedBudget = uni.getStorageSync('budget');
    if (savedBudget) {
      this.budget = savedBudget;
    }
  },
  methods: {
    // 切换到编辑模式
    editBudget() {
      this.isEditing = true;
      this.newBudget = this.budget; // 载入当前预算到输入框
    },
    // 保存新预算
    saveBudget() {
      const parsedBudget = parseFloat(this.newBudget);
      if (isNaN(parsedBudget) || parsedBudget <= 0) {
        uni.showToast({
          title: '请输入有效的数字',
          icon: 'none'
        });
        return;
      }

      this.budget = parsedBudget;
      uni.setStorageSync('budget', this.budget); // 保存到本地存储

      this.isEditing = false; // 退出编辑模式
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
}

.budget-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-text {
  font-size: 20px;
  color: #333;
}

.edit-button {
  padding: 8px 15px;
  background-color: #1aad19;
  color: #fff;
  border-radius: 5px;
  border: none;
}

.budget-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-input {
  width: 70%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.save-button {
  padding: 8px 15px;
  background-color: #2ecc71;
  color: #fff;
  border-radius: 5px;
  border: none;
}
</style>
