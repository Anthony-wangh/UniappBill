<template>
  <view class="container">
    <!-- 饼状图 -->
    <ec-canvas id="pieChart" :canvas-id="'pieChart'" :ec="ec"></ec-canvas>
  </view>
</template>

<script>
import * as echarts from '../../components/ec-canvas/echarts';  // 导入ECharts

export default {
  data() {
    return {
      ec: {
        lazyLoad: true  // 启用懒加载，提升性能
      },
      pieData: [
        { name: '餐饮', value: 500 },
        { name: '交通', value: 300 },
        { name: '娱乐', value: 200 },
      ]
    };
  },
  onReady() {
    this.initPieChart();  // 页面加载后初始化饼状图
  },
  methods: {
    // 初始化饼状图
    initPieChart() {
      const chart = echarts.init(this.selectComponent('#pieChart').canvas);
      chart.setOption({
        title: {
          text: '当月账单分类统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '金额',
            type: 'pie',
            radius: '50%',
            data: this.pieData,  // 使用传入的饼状图数据
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

ec-canvas {
  width: 100%;
  height: 400px;
}
</style>
