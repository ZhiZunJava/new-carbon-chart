<template>
  <div class="rightCenter">
    <dv-capsule-chart :config="config" style="width:100%;height:260px" />
  </div>
</template>

<script>
import { getSaleCustomerRanking } from '../../api/modules';
export default {
  data() {
    return {
      config: {
        showValue: true,
        unit: "万",
        data: []
      },
    };
  },
  created() {
    this.getData();
  },
  beforeDestroy() {
    this.clearData()
  },
  methods: {
    //清理报表数据
    clearData() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    //轮询
    getTimer() {
      if (this.timer) {
        return
      }
      let looper = (a) => {
        this.getData()
      };
      this.timer = setInterval(looper, this.$store.state.setting.echartsAutoTime);
    },
    //获取报表数据
    getData() {
      this.isData = true
      getSaleCustomerRanking().then(data => {
        const [err, res] = data;
        if (!err && res) {
          if (!this.timer) {
          }
          this.config = {
            ...this.config,
            data: res.data
          }
          this.getTimer()
        } else {
          this.isData = false
        }
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.rightCenter {
  box-sizing: border-box;
  padding: 0 16px;
}
</style>