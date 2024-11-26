<template>
  <dv-loading v-if="loading">Loading...</dv-loading>

  <ul class="user-overview flex" v-else-if="isData && !loading">
    <li class="user-overview-item" :style="{ color: '#00fdfa' }">
      <div class="user-overview-num">
        <dv-digital-flop :config="powerConsumeConfig" style="width: 100%; height: 100%;" />
      </div>
      <p>耗电量</p>
    </li>
    <li class="user-overview-item" :style="{ color: '#07f7a8' }">
      <div class="user-overview-num">
        <dv-digital-flop :config="waterConsumeConfig" style="width: 100%; height: 100%;" />
      </div>
      <p>耗水量</p>
    </li>
    <li class="user-overview-item" :style="{ color: '#e3b337' }">
      <div class="user-overview-num">
        <dv-digital-flop :config="carbonEmissionConfig" style="width: 100%; height: 100%;" />
      </div>
      <p>碳排放量</p>
    </li>
  </ul>

  <Reacquire v-else @confirm="getEmissionChartPercentData" line-height="200px">
    重新获取
  </Reacquire>
</template>

<script>
import { getProductPowerReportYear } from '../../api/modules';

const DEFAULT_STYLE = {
  fontSize: 20,
  fill: '#00EAFF',
};

export default {
  data() {
    return {
      loading: true,
      isData: false,
      powerConsumeConfig: this.createConfig(),
      waterConsumeConfig: this.createConfig(),
      carbonEmissionConfig: this.createConfig(),
      timer: null,
    };
  },

  computed: {
    autoTime() {
      return this.$store.state.setting.echartsAutoTime || 5000;
    },
  },

  async created() {
    await this.getEmissionChartPercentData();
  },

  beforeDestroy() {
    this.clearEmissionChartPercentData();
  },

  methods: {
    createConfig(number = [0], fill = '#00EAFF') {
      return {
        number,
        content: '{nt}',
        style: { ...DEFAULT_STYLE, fill },
      };
    },
    async getEmissionChartPercentData() {
      this.loading = true;

      const [err, res] = await getProductPowerReportYear();

      if (!err && res) {
        const data = res.rows[0];

        this.waterConsumeConfig = this.createConfig(
          [data.totalWaterConsume + data.totalOfficeWaterConsume],
          '#07f7a8'
        );
        this.powerConsumeConfig = this.createConfig(
          [data.totalPowerConsume + data.totalOfficePowerConsume],
          '#00fdfa'
        );
        this.carbonEmissionConfig = this.createConfig(
          [data.totalCarbonEmission],
          '#e3b337'
        );
        this.getTimer();
        this.loading = false;
        this.isData = true;
      } else {
        this.isData = false;
        this.loading = false;
      }
    },
    clearEmissionChartPercentData() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    getTimer() {
      if (this.timer) return;

      this.timer = setInterval(this.getEmissionChartPercentData, this.autoTime);
    },
  },
};
</script>

<style lang="scss" scoped>
.user-overview {
  display: flex;
  justify-content: space-between;

  .user-overview-item {
    flex: 1;
    text-align: center;

    p {
      font-size: 16px;
      height: 16px;
      margin-right: 30px;
      user-select: none;
    }

    .user-overview-num {
      width: 140px;
      height: 140px;
      margin: 20px auto 30px;
      background-size: cover;
      background-position: center;
      position: relative;
      line-height: 100px;
      font-size: 12px;
      margin-left: 5px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: 5px;
        background-size: cover;
      }

      &.bgdonghua::before {
        animation: rotating 14s linear infinite;
      }
    }
  }
}


.user-overview-item:nth-child(1) .user-overview-num::before {
  background-image: url("../../assets/img/left_top_lan.png");
}

.user-overview-item:nth-child(2) .user-overview-num::before {
  background-image: url("../../assets/img/left_top_lv.png");
}

.user-overview-item:nth-child(3) .user-overview-num::before {
  background-image: url("../../assets/img/left_top_huang.png");
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>