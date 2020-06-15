<template>
  <div class="search-box">
    <span class="iconfont icon-jiansuo"></span>
    <input ref="input" type="text" v-model.trim="query" class="search-input" :placeholder="placeholder" />
    <span class="iconfont icon-qingchu" v-show="query" @click="clear"></span>
  </div>
</template>

<script>
export default {
  name: "searchBox",
  data() {
    return {
      query: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  created() {
    this.timer
    this.$watch("query", newQuery => {
      let that = this;
      if (that.timer) {
        clearTimeout(that.timer)
      }
      that.timer = setTimeout(() => {
        that.$emit("query", newQuery);
      }, 100);
    });
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      // 将键盘收起来
      this.$refs.input.blur()
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.search-box {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 6px;
  box-sizing: border-box;
  background-color: @color-highlight-background;
  border-radius: 6px;
  span {
    font-size: 24px;
    color: #ccc;
  }
  .search-input {
    flex: 1;
    margin: 0 5px;
    line-height: 40px;
    background: @color-highlight-background;
    color: @color-text;
    font-size: @font-size-medium;
    // 设置input里面的placeholde
    &::placeholder {
      color: @color-text-d;
    }
  }
  .icon-qingchu{
    font-size: 15px;
  }
}
</style>