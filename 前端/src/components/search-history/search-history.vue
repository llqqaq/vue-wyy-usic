<template>
  <div class="search-history">
    <ul class="history-ul">
      <transition-group name="list" tag="ul">
        <li
          class="history-li"
          v-for="item in search"
          :key="item"
          @click="selectItem(item)"
        >
          <span class="text">{{item}}</span>
          <span class="iconfont icon-chushaixuanxiang" @click.stop="deleteOne(item)"></span>
        </li>
      </transition-group>
    </ul>
  </div>
</template>   

<script>
export default {
  name: "searchHistory",
  computed: {},
  props: {
    search: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    deleteOne(value) {
      this.$emit("deleteOne", value);
    },
    selectItem(item) {
      this.$emit("select", item);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.search-history {
  width: 100%;

  .history-ul {
    .history-li {
      display: flex;
      align-items: center;
      height: 40px;
      &.list-enter-active,
      &.list-leave-active {
        transition: all 0.3s;
      }
      &.list-enter,
      &.list-leave-to {
        height: 0;
        opacity: 0;
      }
      .text {
        font-size: @font-size-small;
        color: @color-text-l;
        flex: 1;
      }
      .iconfont {
        font-size: 18px;
        color: @color-text-d;
      }
    }
  }
}
</style>