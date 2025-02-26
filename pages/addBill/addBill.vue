<template>
  <view class="add-bill-container">
    <!-- 时间选择 -->
    <view class="form-group">
      <label for="date">时间</label>
      <picker mode="date" :value="bill.date" @change="onDateChange">
        <text>{{ bill.date || '请选择日期' }}</text>
      </picker>
    </view>

    <!-- 金额输入 -->
    <view class="form-group">
      <label for="amount">金额</label>
      <input 
        type="number" 
        v-model="bill.amount" 
        placeholder="请输入金额"
        @input="validateAmount"
      />
    </view>

    <!-- 账单类型选择 -->
    <view class="form-group">
      <label for="type">账单类型</label>
      <picker mode="selector" :range="types" @change="onTypeChange">
        <text>{{ bill.type || '请选择类型' }}</text>
      </picker>
    </view>

    <!-- 类目选择 -->
    <view class="form-group">
      <label for="category">类目</label>
      <picker mode="selector" :range="selectCategories" @change="onCategoryChange">
        <text>{{ bill.category || '请选择类目' }}</text>
      </picker>
    </view>

    <!-- 备注输入 -->
    <view class="form-group">
      <label for="remark">备注</label>
      <input 
        type="text" 
        v-model="bill.remark" 
        placeholder="请输入备注（非必填）"
      />
    </view>

    <!-- 添加按钮 -->
    <button class="submit-btn" @click="submitBill">添加</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bill: {
        date: new Date().toISOString().slice(0, 10), // 默认当前日期
        amount: '',
        type: '', // 支出或收入
        category: '', // 具体类目
        remark: ''
      },
      types: ['支出', '收入'],
	  
      categories: {
        支出: ['购物', '餐饮', '交通', '娱乐', '房屋'],
        收入: ['工资', '奖金']
      },
	  selectCategories:[]
    };
  },
  methods: {
    onDateChange(e) {
      this.bill.date = e.detail.value;
    },
    validateAmount(e) {
      const value = e.detail.value;
      if (!/^\d*\.?\d*$/.test(value)) {
        this.bill.amount = value.replace(/[^0-9.]/g, '');
      }
    },
    onTypeChange(e) {
      const index = e.detail.value;
      this.bill.type = this.types[index];
      this.bill.category = this.categories[this.bill.type][0]; // 重置类目选择
	  this.selectCategories=this.categories[this.bill.type];
    },
    onCategoryChange(e) {
      const selectedCategories = this.categories[this.bill.type];
      const index = e.detail.value;
      this.bill.category = selectedCategories[index];
    },
    submitBill() {
      if (!this.bill.amount || !this.bill.type || !this.bill.category) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }

      // 获取本地存储中的账单数据
      let bills = uni.getStorageSync('bills') || [];
      
      // 新增账单
      bills.push({
        time: new Date(this.bill.date).getTime(),
        amount: parseFloat(this.bill.amount),
        type: this.bill.type,
        category: this.bill.category,
        remark: this.bill.remark
      });

      // 更新本地存储
      uni.setStorageSync('bills', bills);

      // 清空表单
      this.bill = {
        date: new Date().toISOString().slice(0, 10),
        amount: '',
        type: '',
        category: '',
        remark: ''
      };

      uni.showToast({
        title: '账单添加成功',
        icon: 'success'
      });

      // 返回账单列表页面
      this.$emit('navigateTo', 'bills');
    }
  }
};
</script>

<style lang="scss">
.add-bill-container {
  padding: 20px;
  background-color: #f5f5f5;
  height: calc(100vh - 60px); /* 减去底部导航栏的高度 */
  box-sizing: border-box;

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }

    picker, input {
      width: 100%;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      background-color: #ffffff;
      font-size: 14px;
      color: #333;
    }

    picker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }

    input {
      &::placeholder {
        color: #999;
      }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background-color: #2ecc71;
    color: #fff;
    font-size: 16px;
    text-align: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:active {
      background-color: #27ae60;
    }
  }
}
</style>