<template>		
	<view class="statistics-container">
		<!-- 月份切换 -->
		<view class="month-picker">
		  <view class="arrow" @click="changeMonth(-1)">◀</view>
		  <text class="current-month">{{ currentMonth }}</text>
		  <view class="arrow" @click="changeMonth(1)">▶</view>
		</view>
		
		<PieChart
			ref="pieChart"
			:chartData="chartData"
		> 
		</PieChart>
	</view>
	
	
</template>

<script>
	import PieChart from '@/components/Chart/PieChart.vue';
	export default {
		components: {
			PieChart,
		},
		data() {
			return {
				chartData: {
				  series: [
							{
								data : [
									
									{ name: '一班', value: 256 },
									{ name: '二班', value: 123 },
									{ name: '三班', value: 20 },
									{ name: '四班', value: 0 },
									{ name: '五班', value: 0 },
								]
								
								
							}
							
				    
				  ]
				}, // 用来存储账单数据
				bills:[],
				categories: [{
						name: '购物',
						color: '#ff6b6b',
						type: 'expense'
					},
					{
						name: '餐饮',
						color: '#48dbfb',
						type: 'expense'
					},
					{
						name: '交通',
						color: '#f368e0',
						type: 'expense'
					},
					{ name: '房屋', color: '#eb3b5a', type: 'expense' },
					{ name: '工资', color: '#1dd1a1', type: 'income' },
				],
				currentDate: new Date(),
			};
		},
		onShow() {
			this.loadBills();
			this.$refs.pieChart.drawCharts(this.chartData);
		},
		computed: {
		  currentMonth() {
		    return this.currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
		  }
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
		  
		  const grouped = [];
		  this.categories.forEach(category => {
			  const sery = {};
			  sery.name=category.name;
			  const v=filteredBills
				.filter(item => item.category === category.name)
				.reduce((sum, item) => sum + Number(item.amount), 0)
				.toFixed(2);
				sery.value=Number(v);
				grouped.push(sery);
			});
		  
			var templateData={};
			const seriesItem={};
			seriesItem.data=grouped;
			templateData.series=[seriesItem];
			this.chartData=templateData;
		},
		changeMonth(offset) {
			  const newDate = new Date(this.currentDate);
			  newDate.setMonth(newDate.getMonth() + offset);
			  this.currentDate = newDate;
			  this.filterBillsByMonth();
		},
		}
	};
</script>
<style lang="scss">
	
	/* 月份切换 */
	.month-picker {
		width: 100%;
	    display: flex;
		justify-content: center;
		align-items: center;
		background-color: #96C560;
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
</style>