<template>
  <div id="app">
    <!-- 头部 -->
    <m-header></m-header>
    <!-- 导航 -->
    <div class="tab-wrapper">
      <router-link
        tag="div"
        to="/recommond"
        class="item"
      >
        <span>推荐</span>
      </router-link>
      <router-link
        tag="div"
        to="/singer"
        class="item"
      >
        <span>歌手</span>
      </router-link>
      <router-link
        tag="div"
        to="/rank"
        class="item"
      >
        <span>排行</span>
      </router-link>
      <router-link
        tag="div"
        to="/search"
        class="item"
      >
        <span>搜索</span>
      </router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <player></player>
  </div>
</template>

<script>
import MHeader from "@/components/header/header";
import Player from "@/components/player/player"
export default {
  data() {
    return {
    };
  },
  components: {
    MHeader,
    Player
  },
  methods: {
  }
};
</script>

<style lang='less' scoped>
@import url("~@/common/less/variable.less");
#app {
  width: 100%;
  .tab-wrapper {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: @font-size-medium;
    .item {
      flex: 1;
      text-align: center;
      span {
        padding-bottom: 5px;
        color: @color-text-l;
      }
      &.router-link-active {
        span {
          color: @color-theme;
          border-bottom: 2px solid @color-theme;
        }
      }
    }
  }
}
</style>