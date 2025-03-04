<template>
	<view class="add-bill-container">
		<!-- 时间选择 -->
		<view class="form-group">
			<label for="date">时间</label>
			<picker mode="date" :value="bill.date" @change="onDateChange" class="picker">
				<view class="picker-text">{{ bill.date || '请选择日期' }}</view>
			</picker>
		</view>

		<!-- 金额输入 -->
		<view class="form-group">
			<label for="amount">金额</label>
			<input class="input-field" type="digit" v-model="bill.amount" placeholder="请输入金额" @input="validateAmount" />
		</view>

		<!-- 账单类型选择 -->
		<view class="form-group">
			<label for="type">账单类型</label>
			<picker mode="selector" :range="types" @change="onTypeChange" class="picker">
				<view class="picker-text">{{ bill.type || '请选择类型' }}</view>
			</picker>
		</view>

		<!-- 类目选择 -->
		<view class="form-group">
			<label for="category">类目</label>
			<picker mode="selector" :range="selectCategories" @change="onCategoryChange" class="picker">
				<view class="picker-text">{{ bill.category || '请选择类目' }}</view>
			</picker>
		</view>

		<!-- 备注输入 -->
		<view class="form-group">
			<label for="remark">备注</label>
			<input class="input-field" type="text" v-model="bill.remark" placeholder="请输入备注（非必填）" />
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
					支出: ['购物', '餐饮', '交通', '娱乐','健康','礼物','电子','居住'],
					收入: ['工资', '理财']
				},
				selectCategories: []
			};
		},
		methods: {
			onDateChange(e) {
				this.bill.date = e.detail.value;
			},
			validateAmount(e) {
				let value = e.detail.value;
				// 只允许输入数字和小数点，并确保只有一个小数点
				value = value.replace(/[^0-9.]/g, '') // 只保留数字和.
					.replace(/^0+(\d)/, '$1') // 防止输入多个前导零
					.replace(/\.{2,}/g, '.') // 禁止连续输入多个.
					.replace(/^(\d+)\.(\d{2})\d*$/, '$1.$2'); // 限制小数点后两位
				this.bill.amount = value;
			},
			onTypeChange(e) {
				const index = e.detail.value;
				this.bill.type = this.types[index];
				this.bill.category = this.categories[this.bill.type][0]; // 重置类目选择
				this.selectCategories = this.categories[this.bill.type];
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
				//this.$emit('navigateTo', 'bills');
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss">
	.add-bill-container {
		width: 100%;
		padding: 20px 30px;
		background-color: #f5f5f5;
		box-sizing: border-box;
	
		.form-group {
			margin-bottom: 20px;
	
			label {
				display: block;
				font-size: 15px;
				font-weight: bold;
				color: #666;
				margin-bottom: 5px;
			}
	
			// 统一 input 和 picker 样式
			.input-field, .picker {
				width: 100%;
				height: 45px;
				padding: 0 15px;
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				background-color: #ffffff;
				font-size: 14px;
				color: #333;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
			}
			
			.picker{
				display: block;
			}
	
			// 让 picker 里面的文本完全居中
			.picker-text {
				flex: 1;
				text-align: left;
				line-height: 45px; // 确保与 input 一致
			}
	
	
			.input-field {
				line-height: 45px;
			}
	
			// input 和 picker 的 placeholder 颜色统一
			.input-field::placeholder {
				color: #999;
			}
		}
	
		.submit-btn {
			width: 100%;
			padding: 15px;
			background-color: #7bc7cf;
			color: #fff;
			font-size: 16px;
			text-align: center;
			border: none;
			border-radius: 5px;
			cursor: pointer;
	
			&:active {
				background-color: #a7cbcf;
			}
		}
	}


</style>