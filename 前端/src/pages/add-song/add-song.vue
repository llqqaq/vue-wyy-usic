<template>
  <transition name="slide">
    <div class="add-song" v-show="isShow" @click.stop>
      <div class="header">
        <span class="title">添加歌曲到列表</span>
        <span class="close iconfont icon-chushaixuanxiang" @click="hide"></span>
      </div>
      <div class="search-wrapper">
        <search-box ref="searchBox" @query="query" :placeholder="placeholder"></search-box>
      </div>
      <div class="shortcut" v-show="!value">
        <switches @switches="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
          <!-- 这里是scroll要加样式 -->
          <scroll v-if="currentIndex == 0" :data="getPlayHistory" class="scroll" ref="scrollZero">
            <div class="list-inner">
              <song-list :songs="getPlayHistory" @select="selectItem"></song-list>
            </div>
          </scroll>
          <scroll :refreshDelay="refreshDelay" :data="getSearchHistory" v-if="currentIndex == 1" class="scroll" ref="scrollOne">
            <div class="list-inner">
              <search-history
                :search="getSearchHistory"
                @select="addQuery"
                @deleteOne="deleteHistory"
              ></search-history>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-rusult" v-show="value">
        <suggest :query="value" @chooseItem="setHistory" @beforeScroll="beforeScroll"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from "@/components/search-box/search-box";
import Suggest from "@/components/suggest/suggest";
import { searchMixin } from "@/common/js/mixin";
import Switches from "@/components/switches/switches";
import Scroll from "@/components/scroll/scroll";
import { mapGetters, mapActions } from "vuex";
import SongList from "@/components/song-list/song-list";
import SearchHistory from "@/components/search-history/search-history";
export default {
  mixins: [searchMixin],
  name: "add-song",
  data() {
    return {
      isShow: false,
      placeholder: "搜索歌曲",
      switches: [{ name: "最近播放" }, { name: "搜索历史" }],
      currentIndex: 0,
      refreshDelay:100
    };
  },
  computed: {
    ...mapGetters(["getPlayHistory"])
  },
  methods: {
    show() {
      this.isShow = true;
      if (this.currentIndex === 0) {
        setTimeout(() => {
        this.$refs.scrollZero.refresh()
        },200)
      } else {
        this.$refs.scrollOne.refresh();
      }
    },
    hide() {
      this.isShow = false;
    },
    // 切换索引
    switchItem(index) {
      this.currentIndex = index;
    },
    // 点击播放历史
    selectItem(song, index) {
      console.log(song);
      if (index === 0) return;
      this.insertSong(song);
    },
    ...mapActions(["insertSong"])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchHistory
  },
  created() {
    console.log(this.getPlayHistory);
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.add-song {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background-color: @color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      padding: 12px;
      font-size: 20px;
      color: @color-theme;
    }
    .iconfont {
      font-size: 22px;
    }
  }
  .search-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      overflow: hidden;
      .scroll {
        width: 100%;
        height: 100%;
        .list-inner {
          padding: 20px;
        }
      }
    }
  }
  .search-rusult {
    position: fixed;
    top: 124px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 20px 20px 10px 20px;
    box-sizing: border-box;
  }
}
</style>