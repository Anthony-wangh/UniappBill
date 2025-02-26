<template>
  <view class="bills-container">
    <!-- 月份切换 -->
    <view class="month-picker">
      <view class="arrow" @click="changeMonth(-1)">◀</view>
      <text class="current-month">{{ currentMonth }}</text>
      <view class="arrow" @click="changeMonth(1)">▶</view>
    </view>

    <!-- 支出收入预览 -->
    <view class="summary">
      <view class="income-section">
        <text>总收入</text>
        <text class="income">￥{{ totalIncome }}</text>
      </view>
      <view class="expense-section">
        <text>总支出</text>
        <text class="expense">￥{{ totalExpense }}</text>
      </view>
      <view class="budget-section">
        <text>预算</text>
        <text class="budget">￥{{ budget }}</text>
      </view>
      <view class="balance-section">
        <text>结余</text>
        <text :class="['balance', { 'positive': balance >= 0, 'negative': balance < 0 }]">
          ￥{{ balance }}
        </text>
      </view>
    </view>

    <!-- 账单列表 -->
    <scroll-view class="bill-list" scroll-y>
      <!-- 空状态提示 -->
      <view v-if="Object.keys(groupedBills).length === 0" class="no-bills">
        本月无账单
      </view>

      <view v-for="(group, date) in groupedBills" :key="date">
        <!-- 日期分隔线 -->
        <view class="date-divider">
          <text>{{ formatDate(date) }}</text>
        </view>

        <!-- 账单项 -->
        <view v-for="(item, index) in group" :key="index" class="bill-item">
          <view class="left">
            <view class="category-color" :style="{backgroundColor: getCategoryColor(item.category)}"></view>
            <view class="info">
              <text class="category">{{ item.category }}</text>
              <text class="remark" v-if="item.remark">{{ item.remark }}</text>
            </view>
          </view>
          <view :class="['amount', item.type === 'income' ? 'income' : 'expense']">
            {{ item.type === 'income' ? '+' : '-' }}{{ item.amount }}
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部导航栏 -->
    <view class="navigation-bar">
      <button 
        class="nav-btn add-bill-btn" 
        @click="navigateTo('addBill')"
      >
        添加账单
      </button>
     
      <IconButton 
        class="nav-btn" 
		iconSrc="/static/statiscs.png"
		label="统计"
        @click="navigateTo('statistics')"
      >
        统计
      </IconButton>
      <IconButton 
        class="nav-btn" 
		iconSrc="/static/setting.png"
		label="设置"
        @click="navigateTo('settings')"
      >
        设置
      </IconButton>
    </view>
  </view>
</template>

<script>
import IconButton from '@/components/IconButton/IconButton.vue';
export default {
  data() {
    return {
      bills: [],
      categories: [
        { name: '购物', color: '#ff6b6b', type: 'expense' },
        { name: '餐饮', color: '#48dbfb', type: 'expense' },
        { name: '交通', color: '#f368e0', type: 'expense' },
        { name: '娱乐', color: '#ff9f1c', type: 'expense' },
        { name: '房屋', color: '#eb3b5a', type: 'expense' },
        { name: '工资', color: '#1dd1a1', type: 'income' },
        { name: '奖金', color: '#2ecc71', type: 'income' }
      ],
      totalIncome: 0,
      totalExpense: 0,
      currentDate: new Date(),
      groupedBills: {},
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      budget: uni.getStorageSync('budget') || 0 // 从设置中获取月度预算
    };
  },
  computed: {
    currentMonth() {
      return this.currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    },
    balance() {
      return  Number(this.budget)+Number(this.totalIncome) - Number(this.totalExpense);
    }
  },
  onShow() {
    this.loadBills();
	this.budget=uni.getStorageSync('budget') || 0 ;
  },
  methods: {
    loadBills() {
      const bills = uni.getStorageSync('bills') || [];
      this.bills = bills;
      this.filterBillsByMonth();
    },
    filterBillsByMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const filteredBills = this.bills.filter(bill => {
        const billDate = new Date(bill.time);
        return billDate.getFullYear() === year && billDate.getMonth() === month;
      });

      this.totalPages = Math.ceil(filteredBills.length / this.pageSize);
      this.groupBillsByDate(filteredBills.slice(0, this.pageSize * this.currentPage));
      this.calculateTotal(filteredBills);
    },
    groupBillsByDate(bills) {
      const grouped = {};
      bills.forEach(bill => {
        const date = new Date(bill.time).toLocaleDateString();
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(bill);
      });
      this.groupedBills = grouped;
    },
    calculateTotal(bills) {
      this.totalIncome = bills
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0)
        .toFixed(2);

      this.totalExpense = bills
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0)
        .toFixed(2);
    },
    changeMonth(offset) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      this.currentDate = newDate;
      this.filterBillsByMonth();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    getCategoryColor(categoryName) {
      const category = this.categories.find(c => c.name === categoryName);
      return category ? category.color : '#cccccc';
    },
    navigateTo(page) {
      uni.navigateTo({
        url: `/pages/${page}/${page}`
      });
    }
  }
};
</script>
<style lang="scss">
.bills-container {
  //padding: 20px;
  background-color: #f5f5f5;
  height: calc(100vh - 50px); /* 减去底部导航栏的高度 */
  width: 100%;
  box-sizing: border-box;

  /* 月份切换 */
  .month-picker {
	width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #96C560;
    //border-radius: 0px;
    //margin-bottom: 20px;
	padding: 5px 0;

    .arrow {
      font-size: 18px;
      color: #e8e8e8;
      margin: 0 15px;
    }

    .current-month {
      font-size: 16px;
      font-weight: bold;
      color: #ebebeb;
    }
  }

  /* 支出收入预览 */
  .summary {
    display: flex;
    justify-content: space-around;
    background-color: #f1f1f1;
    padding: 20px 0;
    //border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    //margin-bottom: 20px;

    .income-section,
    .expense-section,
    .budget-section,
    .balance-section {
      text-align: center;

      text {
        display: block;
        font-size: 14px;
        color: #666;
      }

      .income,
      .expense,
      .budget,
      .balance {
        font-size: 18px;
        font-weight: bold;
        margin-top: 5px;
      }

      .income {
        color: #67d1c1;
      }

      .expense {
        color: #ffc595;
      }

      .budget {
        color: #8d8d8d;
      }

      .balance {
        &.positive {
          color: #3d3d3d;
        }

        &.negative {
          color: #ffc595;
        }
      }
    }
  }

  /* 账单列表 */
  .bill-list {
    height: calc(100% - 150px); /* 减去顶部和底部模块的高度 */
    overflow-y: auto;
    //padding: 10px 0;
	width: 100%;

    .no-bills {
      text-align: center;
      font-size: 20px;
      color: #999;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .date-divider {
      padding: 10px 25px;
      font-size: 14px;
	  font-weight: bold;
	  
      color: #666;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 10px;
    }

    .bill-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f8f8f8;
      padding: 15px 25px;
      border-radius: 5px;
      margin-bottom: 10px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	  height: 30px;

      .left {
        display: flex;
        align-items: center;

        .category-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .info {
          .category {
            display: block;
            font-size: 16px;
            color: #333;
            margin-bottom: 5px;
          }

          .remark {
            font-size: 12px;
            color: #797979;
            margin-top: 3px;
          }
        }
      }

      .amount {
        font-size: 18px;

        &.income {
          color: #67d1c1;
        }

        &.expense {
          color: #ffc595;
        }
      }
    }
  }

  /* 底部导航栏 */
  .navigation-bar {
    //position: fixed;
    //bottom: 0;
    //left: 0;
    width: 100%;
	height: 50px;
    display: flex;
    //justify-content: space-around;
	box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 1.0); /* 半透明背景 */
    backdrop-filter: blur(10px); /* 模糊效果 */
    padding: 10px 0;
    z-index: 1000;
    //border-top: 1px solid #e0e0e0;

    .nav-btn {
      font-size: 14px;
      color: #828282;
	  background-color:transparent;
	  padding: 10px 20px;
	  border:none;

      &.add-bill-btn {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        background-color: #96C560;
        border-radius: 5px;
        padding: 10px 20px;

        &:active {
          background-color: #27ae60;
          transform: scale(0.98);
        }
      }

    }
  }
}
</style>