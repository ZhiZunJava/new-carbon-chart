<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:29:08
 * @LastEditors: Litheme
 * @LastEditTime: 2024-11-20 00:16:40
 * @FilePath: \chart\src\components\echart\index.vue
-->
<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import themeConfig from './theme.json' // 引入默认主题

export default {
  name: 'echart',
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    options: {
      handler(val) {
        this.chart.setOption(val)
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, themeConfig)
      this.chart.setOption(this.options, true)
    }
  }
}
</script>

<style></style>
