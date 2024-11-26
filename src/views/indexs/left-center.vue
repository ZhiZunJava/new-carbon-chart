<template>
  <dv-loading v-if="loading">Loading...</dv-loading>
  <Echart v-else-if="isData && !loading" id="leftCenter" :options="options" class="left_center_inner" ref="charts" />
  <Reacquire v-else @confirm="getEmissionChartPercentData" style="line-height: 200px">
    重新获取
  </Reacquire>
</template>

<script>
import { getEmissionChartPercent } from "../../api/modules";

export default {
  data() {
    return {
      options: {},
      data: {
        totalPowerConsume: 0,
        totalOfficePowerConsume: 0,
        totalWaterConsume: 0,
        totalOfficeWaterConsume: 0
      },
      loading: false,
      isData: false,
      timer: null
    };
  },
  async created() {
    await this.getEmissionChartPercentData();
  },
  methods: {
    // 获取并更新数据
    async getEmissionChartPercentData() {
      this.loading = true;
      const [err, res] = await getEmissionChartPercent();
      if (!err && res) {
        this.data = res.data[0];
        this.$nextTick(() => {
          this.initChart();
          this.getTimer();
          this.isData = true;
        });
      } else {
        this.isData = false;
      }
      this.loading = false;
    },

    // 初始化Echart配置
    initChart() {
      const total =
        this.data.totalPowerConsume +
        this.data.totalOfficePowerConsume +
        this.data.totalWaterConsume +
        this.data.totalOfficeWaterConsume;
      const colors = ["#00fdfa", "#07f7a8", "#e3b337", "#ffc000"];
      const pieConfig = {
        name: "能耗占比",
        type: "pie",
        radius: ["40%", "65%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "rgba(0,0,0,0)",
          borderWidth: 2
        },
        color: colors,
        data: [
          {
            value: this.data.totalWaterConsume,
            name: "生产用水量",
            label: { shadowColor: colors[3] }
          },
          {
            value: this.data.totalPowerConsume,
            name: "生产耗电量",
            label: { shadowColor: colors[0] }
          },
          {
            value: this.data.totalOfficePowerConsume,
            name: "办公耗电量",
            label: { shadowColor: colors[2] }
          },
          {
            value: this.data.totalOfficeWaterConsume,
            name: "办公用水量",
            label: { shadowColor: colors[1] }
          }
        ]
      };

      this.options = {
        title: {
          text: ["{value|" + total + "}", "{name|总数}"].join("\n"),
          top: "center",
          left: "center",
          textStyle: {
            rich: {
              value: {
                color: "#ffffff",
                fontSize: 24,
                fontWeight: "bold",
                lineHeight: 20
              },
              name: {
                color: "#ffffff",
                lineHeight: 20
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0,0,0,.6)",
          borderColor: "rgba(147, 235, 248, .8)",
          textStyle: {
            color: "#FFF"
          }
        },
        legend: {
          show: false,
          top: "5%",
          left: "center"
        },
        series: [
          {
            ...pieConfig,
            tooltip: { show: true },
            label: {
              formatter: "   {b|{b}}   \n   {c|{c}}   {per|{d}%}  ",
              rich: {
                b: {
                  color: "#fff",
                  fontSize: 12,
                  lineHeight: 26
                },
                c: {
                  color: "#31ABE3",
                  fontSize: 14
                },
                per: {
                  color: "#31ABE3",
                  fontSize: 14
                }
              }
            },
            labelLine: {
              length: 20,
              length2: 36,
              show: true,
              emphasis: {
                show: true
              }
            }
          },
          {
            ...pieConfig,
            tooltip: { show: true },
            itemStyle: {},
            label: {
              backgroundColor: "auto",
              height: 0,
              width: 0,
              lineHeight: 0,
              borderRadius: 2.5,
              shadowBlur: 8,
              shadowColor: "auto",
              padding: [2.5, -2.5, 2.5, -2.5]
            },
            labelLine: {
              length: 20,
              length2: 36,
              show: false
            }
          }
        ]
      };
    },

    // 初始化定时器
    getTimer() {
      if (this.timer) return; // 如果定时器已经存在，则不再创建新的

      this.timer = setInterval(async () => {
        await this.getEmissionChartPercentData();
      }, 5000);

      this.$nextTick(() => {
        let chartRef = this.$refs.charts.chart;
        chartRef.on("mouseover", () => {
          this.stopTimer(); // 停止定时器
        });
        chartRef.on("mouseout", () => {
          this.restartTimer(); // 鼠标移出时重新启动定时器
        });
      })
    },

    // 清理定时器
    clearEmissionChartPercentData() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    // 清除定时器并停止刷新
    stopTimer() {
      this.clearEmissionChartPercentData();
    },

    // 启动定时器
    restartTimer() {
      if (!this.timer) {
        this.getTimer();
      }
    }
  },

  beforeDestroy() {
    this.clearEmissionChartPercentData();
  }
};
</script>

<style lang="scss" scoped></style>
