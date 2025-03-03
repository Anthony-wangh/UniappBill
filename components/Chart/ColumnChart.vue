<template>
	<view>
		<canvas :canvas-id="canvasId" :id="canvasId" class="charts"
			@touchend="tap" />
	</view>
</template>

<script>
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js';
	var uChartsInstance = {};
	export default {
		data() {
			return {
				canvasId: {
					type: String,
				}
			};
		},
		
		methods: {
			drawCharts(data) {
				const id = this.canvasId;
				const ctx = uni.createCanvasContext(id, this);
				uChartsInstance[id] = new uCharts({
					type: "column",
					context: ctx,
					width: uni.upx2px(750),
					height: uni.upx2px(500),
					categories: data.categories,
					series: data.series,
					animation: true,
					timing: "easeOut",
					duration: 1000,
					rotate: false,
					rotateLock: false,
					background: "#FFFFFF",
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 5],
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
					xAxis: {
						disableGrid: true,
						disabled: false,
						axisLine: true,
						axisLineColor: "#CCCCCC",
						calibration: false,
						fontColor: "#666666",
						fontSize: 13,
						lineHeight: 20,
						marginTop: 0,
						rotateLabel: false,
						rotateAngle: 45,
						itemCount: 5,
						boundaryGap: "center",
						splitNumber: 5,
						gridColor: "#CCCCCC",
						gridType: "solid",
						dashLength: 4,
						gridEval: 1,
						scrollShow: false,
						scrollAlign: "left",
						scrollColor: "#A6A6A6",
						scrollBackgroundColor: "#EFEBEF",
						title: "",
						titleFontSize: 13,
						titleOffsetY: 0,
						titleOffsetX: 0,
						titleFontColor: "#666666",
						formatter: ""
					},
					yAxis: {
						data: [{
							min: 0
						}],
						disabled: false,
						disableGrid: false,
						splitNumber: 5,
						gridType: "solid",
						dashLength: 8,
						gridColor: "#CCCCCC",
						padding: 10,
						showTitle: false
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08,
							seriesGap: 2,
							categoryGap: 3,
							barBorderCircle: false,
							linearType: "none",
							linearOpacity: 1,
							colorStop: 0,
							meterBorder: 1,
							meterFillColor: "#FFFFFF",
							labelPosition: "outside"
						},
						tooltip: {
							showBox: true,
							showArrow: true,
							showCategory: false,
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
						},
						markLine: {
							type: "solid",
							dashLength: 4,
							data: []
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
</script>

<style scoped>
	.charts {
		width: 750rpx;
		height: 500rpx;
	}
</style>