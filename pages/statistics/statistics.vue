<template>
	<view class="statistics-container">
		<!-- 月份切换 -->
		<view class="month-picker">
			<view class="arrow" @click="changeMonth(-1)">◀</view>
			<text class="current-month">{{ currentMonth }}</text>
			<view class="arrow" @click="changeMonth(1)">▶</view>
		</view>


		<!-- 空状态提示 -->
		<view v-if="Object.keys(groupBills).length === 0" class="no-bills">
			本月无账单
		</view>

		<view>
		<text class="pieChartTitle">当月支出排行</text>
		<PieChart ref="pieChart" canvasId='PieChartCanvas'>
		</PieChart>

		<!-- 账单列表 -->
		<view class="bill-list" scroll-y>

			<!-- 账单项 -->
			<view v-for="(item, index) in groupBills" :key="index" class="bill-item">
				<view class="left">
					<image :src="getCategoryColor(item.name)" class="category-color">
					</image>
					<view class="info">
						<text class="category">{{ item.name }}</text>
					</view>
				</view>
				<view class="amount">
					{{ item.value.toString()}}
				</view>
			</view>
		</view>

		<text class="columnChartTitle">每日账单</text>
		<ColumnChart ref="columnChart" canvasId='ColumnChart'>
		</ColumnChart>
		</view>
	</view>


</template>

<script>
	import PieChart from '@/components/Chart/PieChart.vue';
	import ColumnChart from '@/components/Chart/ColumnChart.vue';
	export default {
		components: {
			PieChart,
			ColumnChart
		},
		data() {
			return {
				columnChartData: {
					categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
					series: [{
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
					series: [{
							data: [

								{
									name: '一班',
									value: 256
								},
								{
									name: '二班',
									value: 123
								},
								{
									name: '三班',
									value: 20
								},
								{
									name: '四班',
									value: 0
								},
								{
									name: '五班',
									value: 0
								},
							]

						}


					],

				}, // 用来存储账单数据
				bills: [],
				billsInCurrentMouth: [],
				categories: [{
						name: '购物',
						color: '#ff6b6b',
						type: 'expense',
						icon: 'Groceries'
					},
					{
						name: '餐饮',
						color: '#48dbfb',
						type: 'expense',
						icon: 'Restaurant'
					},
					{
						name: '交通',
						color: '#f368e0',
						type: 'expense',
						icon: 'Transportation'
					},
					{
						name: '娱乐',
						color: '#ff9f1c',
						type: 'expense',
						icon: 'Party'
					},
					{
						name: '健康',
						color: '#eb3b5a',
						type: 'expense',
						icon: 'Health'
					},
					{
						name: '电子',
						color: '#f368e0',
						type: 'expense',
						icon: 'Electronics'
					},
					{
						name: '礼物',
						color: '#ff9f1c',
						type: 'expense',
						icon: 'Electronics'
					},
					{
						name: '起居',
						color: '#eb3b5a',
						type: 'expense',
						icon: 'Institute'
					},

				],
				currentDate: new Date(),
			};
		},
		onShow() {
			this.loadBills();
			this.update();
		},
		computed: {
			currentMonth() {
				const year = this.currentDate.getFullYear();
				const month = this.currentDate.getMonth() + 1; // getMonth() 返回 0-11，需要 +1
				return `${year}年${month}月`;
			}
		},
		methods: {

			update() {
				this.filterBillsByMonth();
				this.updatePieChart();
				this.updateColumnChart();

				this.$refs.pieChart?.drawCharts(this.chartData);
				this.$refs.columnChart?.drawCharts(this.columnChartData);
			},

			loadBills() {
				const bills = uni.getStorageSync('bills') || [];
				this.bills = bills;
			},


			filterBillsByMonth() {
				const year = this.currentDate.getFullYear();
				const month = this.currentDate.getMonth();

				this.billsInCurrentMouth = this.bills.filter(bill => {
					const billDate = new Date(bill.time);
					return billDate.getFullYear() === year && billDate.getMonth() === month;
				});


			},

			updatePieChart() {
				const grouped = [];
				this.categories.forEach(category => {
					const sery = {};
					sery.name = category.name;
					const v = this.billsInCurrentMouth
						.filter(item => item.category === category.name)
						.reduce((sum, item) => sum + Number(item.amount), 0)
						.toFixed(2);

					sery.value = Number(v);
					if(sery.value>0){
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
				this.billsInCurrentMouth.forEach(bill => {
					const date = new Date(bill.time).getDay().toString();
					if (bill.type === 'expense') {
						if (!groupedExpense[date]) {
							groupedExpense[date] = 0;
							if (days.findIndex(c => c === date) === -1)
								days.push(date);
						}
						groupedExpense[date] = groupedExpense[date] + Number(bill.amount);
					} else {
						if (!groupedIncome[date]) {
							groupedIncome[date] = 0;
							if (days.findIndex(c => c === date) === -1)
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
				const category = this.categories.find(c => c.name === categoryName);
				return `/static/typeIcons/${category ? category.icon : 'Maintenance'}.png` ;
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
		background-color: #7bc7cf;
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

	/*空白页*/
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

	/* 账单列表 */
	.bill-list {
		/* 减去顶部和底部模块的高度 */
		overflow-y: auto;
		padding: 10px 0;
		width: 100%;



		.bill-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #f8f8f8;
			padding: 10px 25px;
			border-radius: 1px;
			margin-bottom: 2px;
			//box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
			height: 20px;

			.left {
				display: flex;
				align-items: center;

				.category-color {
					width: 25px;
					height: 25px;
					margin-right: 10px;
				}

				.info {
					.category {
						display: block;
						font-size: 14px;
						color: #505050;
						//margin-bottom: 5px;
					}
				}
			}

			.amount {
				font-size: 15px;
				color: #ffc595;
			}
		}
	}


	.pieChartTitle {
		padding: 30px 10px;
		font-size: 30;
		font-weight: bold;
		color: #919191;
	}

	.columnChartTitle {
		padding: 30px 10px;
		font-size: 30;
		font-weight: bold;
		color: #919191;
	}
</style>