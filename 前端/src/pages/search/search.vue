<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-wrapper">
      <search-box @query="query" ref="searchBox"></search-box>
    </div>
    <!-- 热搜 -->
    <div class="shortcut-wrapper" v-show="!value">
      <h1>热门搜索</h1>
      <div class="hot-key">
        <ul>
          <li v-for="key in hotKey" :key="key.first" @click="addQuery(key.first)">{{key.first}}</li>
        </ul>
      </div>
      <!-- 搜索历史 -->
      <div class="history-wrapper">
        <div class="title-wrapper">
          <span class="text">搜索历史</span>
          <span class="iconfont icon-trash" @click="clear"></span>
        </div>
        <search-history
          @deleteOne="deleteHistory"
          :search="getSearchHistory"
          v-show="getSearchHistory.length"
          @select="get"
        ></search-history>
      </div>
    </div>
    <!-- 搜索列表 -->
    <div class="suggest-wrapper" v-show="value">
      <suggest :query="value" @beforeScroll="beforeScroll" @chooseItem="setHistory"></suggest>
    </div>
    <confirm ref="confirm" deleteOne="deleteHistory" @confirm="confirm"></confirm>
  </div>
</template>

<script>
import SearchHistory from "@/components/search-history/search-history";
import SearchBox from "@/components/search-box/search-box";
import Suggest from "@/components/suggest/suggest";
import { getHotKey } from "@/api/http";
import { mapMutations } from "vuex";
import Confirm from "@/components/confirm/confirm";
import { clearHistory } from "@/common/js/cache.js";
import { searchMixin } from "@/common/js/mixin";

export default {
  name: "search",
  mixins:[searchMixin],
  data() {
    return {
      hotKey: []
    };
  },
  // computed: {
  //   ...mapGetters(["getSearchHistory"])
  // },
  components: {
    SearchBox,
    Suggest,
    SearchHistory,
    Confirm
  },
  created() {
    this.getHot();
  },
  methods: {
    get() {
      
    },
    // 获取热搜词
    getHot() {
      getHotKey().then(res => {
        if (res.data.code === 200) {
          this.hotKey = res.data.result.hots;
        }
      });
    },
    // input发生改变
    query(newQuery) {
      this.value = newQuery;
    },
    // addQuery(query) {
    //   this.$refs.searchBox.setQuery(query);
    // },
    // // 滚动触发
    // beforeScroll() {
    //   // 收起键盘
    //   this.$refs.searchBox.blur();
    // },
    // 缓存历史
    // setHistory(value) {
    //   this.cacheHistory(value);
    //   this.value = "";
    // },
    // 清空所有历史
    clear() {
      this.$refs.confirm.show();
    },
    confirm() {
      clearHistory();
      this.clearSHistory();
    },
    // ...mapActions(["cacheHistory","deleteHistory"]),
    ...mapMutations(["clearSHistory"])
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        console.log("我是外面的，我变空了");
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable");
.search {
  padding: 20px 20px 0 20px;
  .shortcut-wrapper {
    margin-top: 20px;
    h1 {
      text-align: center;
      margin-bottom: 20px;
      font-size: @font-size-medium;
      color: @color-text-l;
    }
    .hot-key {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          text-align: center;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: @color-highlight-background;
          font-size: @font-size-medium;
          color: @color-text-d;
        }
      }
    }
    .history-wrapper {
      width: 100%;
      margin-top: 20px;
      .title-wrapper {
        display: flex;
        align-items: center;
        height: 40px;
        .text {
          font-size: @font-size-small;
          color: @color-text-l;
          flex: 1;
        }
        .iconfont {
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
    }
  }
  .suggest-wrapper {
    position: fixed;
    top: 136px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px 10px 20px;
    box-sizing: border-box;
  }
}
</style>