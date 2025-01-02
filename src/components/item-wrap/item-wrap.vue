<template>
  <dv-border-box-13 class="lr-titles">
    <div v-if="title" class="item-title">
      <div class="item-title-left"></div>
      <span class="title-inner">{{ title }}</span>
      <div class="item-title-right"></div>
    </div>
    <div :class="contentClass">
      <slot></slot>
    </div>
  </dv-border-box-13>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    contentClass() {
      return this.title ? "item-title-content" : "item-title-content-def";
    },
  },
};
</script>

<style lang="scss" scoped>

.lr-titles {
  box-sizing: border-box;

  ::v-deep .border-box-content {
    padding: 6px 16px 0;
  }

  .item-title {
    height: 38px;
    line-height: 38px;
    width: 100%;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .item-title-left,
    .item-title-right {
      width: 58px;
      height: 14px;
      background-image: url("../../assets/img/titles/zuo.png");
      background-size: cover;
    }

    .item-title-right {
      transform: rotate(180deg);
    }

    .title-inner {
      font-weight: 900;
      letter-spacing: 2px;
      background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.85%, #01aaff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .item-title-content {
    height: calc(100% - 38px);
  }

  .item-title-content-def {
    width: 100%;
    height: 100%;
  }
}
</style>