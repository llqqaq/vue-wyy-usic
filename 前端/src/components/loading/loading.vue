<template>
  <div class="loading-wrapper">
    <img src="./loading.gif" width="24" height="24" alt />
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在载入..."
    }
  }
};
</script>

<style lang='less' scoped>
@import url("~@/common/less/variable");
.loading-wrapper {
  text-align: center;
  .title {
    text-align: center;
    line-height: 20px;
    font-size: @font-size-small;
    color: yellow;
  }
}
</style>