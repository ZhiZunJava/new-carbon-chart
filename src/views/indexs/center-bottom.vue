<template>
  <div class="center_bottom" v-if="isData">
    <Echart :options="options" id="bottomLeftChart" class="echarts_bottom"></Echart>
  </div>
</template>

<script>
import { getSalePlanAchieveRate } from '../../api/modules';

export default {
  data() {
    return {
      isData: false,
      timer: null,
      options: {},
    };
  },
  mounted() {
    this.getData();
  },
  beforeUnmount() {
    this.clearData();
  },
  methods: {
    // 清理图标数据
    clearData() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    // 获取图标数据
    async getData() {
      this.isData = true;
      try {
        const [err, res] = await getSalePlanAchieveRate();
        if (!err && res) {
          this.init(res.data);
          this.startPolling();
        } else {
          this.isData = false;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    // 启动轮询
    startPolling() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        this.getData();
      }, this.$store.state.setting.echartsAutoTime);
    },

    // 初始化图表配置
    init(newData) {
      const commonAxisConfig = {
        axisLine: { lineStyle: { color: "#B4B4B4" } },
        axisTick: { show: false },
      };

      const commonYAxisConfig = {
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#B4B4B4" } },
      };

      this.options = {
        tooltip: this.getTooltipConfig(),
        legend: this.getLegendConfig(),
        grid: { left: "50px", right: "80px", bottom: "40px", top: "50px" },
        xAxis: { ...commonAxisConfig, data: newData.category },
        yAxis: [
          { ...commonYAxisConfig, axisLabel: { formatter: "{value}万" } },
          { ...commonYAxisConfig, axisLabel: { formatter: "{value}%" } },
        ],
        series: this.getSeriesConfig(newData),
      };
    },

    // 获取 Tooltip 配置
    getTooltipConfig() {
      return {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,.6)",
        borderColor: "rgba(147, 235, 248, .8)",
        textStyle: { color: "#FFF" },
        formatter: this.formatTooltip,
      };
    },

    // 获取 Legend 配置
    getLegendConfig() {
      return {
        data: ["已销售", "计划销售", "完成率"],
        textStyle: { color: "#B4B4B4" },
        top: "0",
      };
    },

    // 获取 Series 配置
    getSeriesConfig(newData) {
      return [
        this.createBarSeries("已销售", newData.barData, "#956FD4", "#3EACE5"),
        this.createBarSeries("计划销售", newData.lineData, "rgba(156,107,211,0.8)", "rgba(156,107,211,0.2)", true),
        this.createLineSeries("完成率", newData.rateData),
      ];
    },

    // 创建 Bar 类型的 Series
    createBarSeries(name, data, startColor, endColor, isLine = false) {
      return {
        name,
        type: "bar",
        barWidth: 10,
        barGap: isLine ? "-100%" : undefined,
        itemStyle: {
          normal: {
            barBorderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: startColor },
              { offset: 1, color: endColor },
            ]),
          },
        },
        data,
      };
    },

    // 创建 Line 类型的 Series
    createLineSeries(name, data) {
      return {
        name,
        type: "line",
        smooth: true,
        showAllSymbol: true,
        symbol: "emptyCircle",
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: { normal: { color: "#F02FC2" } },
        data,
      };
    },

    // 格式化 Tooltip 内容
    formatTooltip(params) {
      let result = params[0].name + "<br>";
      params.forEach(item => {
        const value = item.value || '-';
        const unit = item.seriesName === "完成率" ? "%" : "万";
        result += `${item.marker} ${item.seriesName} : ${value}${unit}</br>`;
      });
      return result;
    },
  },
}
</script>

<style lang="scss" scoped>
.center_bottom {
  width: 100%;
  height: 100%;

  .echarts_bottom {
    width: 100%;
    height: 100%;
  }
}
</style>
