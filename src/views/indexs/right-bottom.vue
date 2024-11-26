<template>
  <div class="right-bottom-wrap beautify-scroll-def">

    <dv-loading v-if="loading">Loading...</dv-loading>

    <vue-seamless-scroll v-else-if="isData" :data="list" :class-option="scrollOptions">
      <ul class="right-bottom">
        <li class="right-bottom-item" v-for="(item, i) in list" :key="i">
          <span class="order-num dou-dong">{{ i + 1 }}</span>

          <div class="inner-right">
            <div class="page-foot"></div>

            <div class="flex">
              <div class="info">
                <span class="labels">产品：</span>
                <span class="contents material-name dou-dong">{{ item.materialName }}</span>
              </div>
              <div class="info">
                <span class="labels">型号：</span>
                <span class="contents" style="font-size: 12px">{{ item.materialModel }}</span>
              </div>
              <div class="info">
                <span class="labels">规格：</span>
                <span class="contents warning" style="font-size: 12px">{{ item.materialSpecification }}</span>
              </div>
              <div class="info">
                <span class="labels">单位：</span>
                <span class="contents warning" style="font-size: 12px">{{ item.materialUnit }}</span>
              </div>
            </div>

            <div class="flex address-wrap">
              <div class="info">
                <span class="labels">库存：</span>
                <span class="contents" style="font-size: 12px">{{ item.totalInventory }}</span>
              </div>
              <div class="info">
                <span class="labels">已生产：</span>
                <span class="contents" style="font-size: 12px">{{ item.productQuantity }}</span>
              </div>
              <div class="info">
                <span class="labels">待生产：</span>
                <span class="contents" style="font-size: 12px">{{ item.requireQuantity }}</span>
              </div>
              <div class="info">
                <span class="labels">碳排放：</span>
                <span class="contents" style="font-size: 12px">{{ item.totalCarbonEmission }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </vue-seamless-scroll>

    <Reacquire v-else @confirm="getData" style="line-height: 200px">重新获取</Reacquire>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll';
import { getMaterialInventory, getProductPowerReport } from '../../api/modules';

export default {
  components: {
    vueSeamlessScroll
  },
  data() {
    return {
      list: [],
      isData: false,
      loading: false,
      scrollOptions: {
        ...this.$store.state.setting.defaultOption,
        singleHeight: 240,
        limitMoveNum: 5,
        step: 0
      }
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      const [err, res] = await getProductPowerReport({
        pageNum: 1,
        pageSize: 20
      });

      if (!err && res) {
        this.list = res.rows;
        this.isData = true;
        this.setScrollStep();
      } else {
        this.isData = false;
      }
    },
    // 设置滚动步长
    setScrollStep() {
      setTimeout(() => {
        this.scrollOptions.step = this.$store.state.setting.defaultOption.step;
      }, this.$store.state.setting.defaultOption.waitTime);
    },
    // 判断是否存在库存限制
    hasInventoryLimits(item) {
      return item.minInventory || item.maxInventory;
    },
    // 获取库存状态的类
    inventoryStatusClass(item) {
      return {
        'type-red': item.maxInventory && item.totalInventory > item.maxInventory,
        'type-green': item.minInventory && item.totalInventory < item.minInventory
      };
    },
    // 获取库存状态文本
    inventoryStatusText(item) {
      if (item.minInventory && item.totalInventory < item.minInventory) {
        return '不足';
      }
      if (item.maxInventory && item.totalInventory > item.maxInventory) {
        return '溢出';
      }
      return '正常';
    }
  }
};
</script>

<style lang="scss" scoped>
.right-bottom-wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.dou-dong {
  overflow: hidden;
  backface-visibility: hidden;
}

.right-bottom {
  width: 100%;
  height: 100%;

  .right-bottom-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 14px;
    margin: 10px 0;

    .order-num {
      width: 20px;
      margin: 0 16px 0 -20px;
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      color: #fff;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .material-name {
        color: $primary-color;
        font-weight: 900;
        font-size: 15px;
        width: 80px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #e6a23c;
        font-size: 15px;
      }
    }

    .inner-right {
      position: relative;
      width: 380px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .page-foot {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("../../assets/img/zuo_xuxian.png");
        bottom: -10px;
        left: -2%;
        background-size: cover;
      }

      .address-wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
      }
    }

    .types {
      width: 30px;
      flex-shrink: 0;
    }

    .type-red {
      color: #fc1a1a;
    }

    .type-green {
      color: #29fc29;
    }
  }
}
</style>
