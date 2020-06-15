<template>
  <div class="user-center">
    <div class="user-header">
      <switches :switches="switches" @switches="toggle" :currentIndex="currentIndex"></switches>
      <span class="back iconfont icon-fanhui" @click="back"></span>
    </div>
    <div class="btn-wrapper">
      <div class="btn">
        <span class="iconfont icon-bofang"></span>
        <span class="text" @click="random">随机播放全部</span>
      </div>
    </div>
    <div class="list-wrapper" ref="listWrapper">
      <scroll class="scroll" ref="fScroll" :data="getFavorite" v-if="currentIndex === 0">
        <div class="list-inner">
          <song-list :songs="getFavorite" @select="selectSong"></song-list>
        </div>
      </scroll>
      <scroll class="scroll" ref="pScroll" :data="getPlayHistory" v-if="currentIndex === 1">
        <div class="list-inner">
          <song-list :songs="getPlayHistory" @select="selectSong"></song-list>
        </div>
      </scroll>
      <div class="no-result" v-show="getShow">
        <div class="img"></div>
        <span class="text">{{getText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Switches from "@/components/switches/switches";
import { mapGetters, mapActions } from "vuex";
import SongList from "@/components/song-list/song-list";
import Scroll from "@/components/scroll/scroll";
import { playListMixin } from "@/common/js/mixin";
export default {
  mixins: [playListMixin],
  name: "userCenter",
  data() {
    return {
      switches: [{ name: "我喜欢的" }, { name: "我收藏的" }],
      currentIndex: 0
    };
  },
  computed: {
    ...mapGetters(["getPlayHistory", "getFavorite"]),
    // 是否展示
    getShow() {
      if (this.currentIndex === 0) {
        return !this.getFavorite.length;
      } else {
        return !this.getPlayHistory.length;
      }
    },
    getText() {
      if(this.currentIndex===0){  
        return '暂无收藏歌曲'
      }else{
        return '你还没有听过歌曲'
      }
    }
  },
  methods: {
    toggle(currentIndex) {
      this.currentIndex = currentIndex;
    },
    back() {
      this.$router.back();
    },
    selectSong(song) {
      this.insertSong(song);
    },
    // 随机播放
    random() {
      let list =
        this.currentIndex === 0 ? this.getFavorite : this.getPlayHistory;
        if(!list.length){
          return
        }
      this.randomPlay({
        list
      });
    },
    handlePlayList(newValue) {
      let bottom = newValue.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.fScroll && this.$refs.fScroll.refresh();
      this.$refs.pScroll && this.$refs.pScroll.refresh();
    },
    ...mapActions(["insertSong", "randomPlay"])
  },
  components: {
    Switches,
    SongList,
    Scroll
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
@import url("~@/common/less/mixin");
.bg-image(@url) {
  background-image: url("@{url}@2x.png");
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url("@{url}@3x.png");
  }
}
.user-center {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: @color-background;
  .user-header {
    margin-top: 10px;
    margin-bottom: 30px;
    width: 100%;
    position: relative;
    .back {
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .btn-wrapper {
    box-sizing: border-box;
    width: 135px;
    margin: 0 auto;
    margin-bottom: 30px;
    color: @color-text-l;
    font-size: 0;
    .btn {
      width: 100%;
      height: 100%;
      padding: 7px 0;
      text-align: center;
      border: 1px solid @color-text-l;
      border-radius: 100px;
      .iconfont {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: @font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .scroll {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px;
      }
    }
  }
  .no-result {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .img {
      width: 86px;
      height: 90px;
      background-size: 86px 90px;
      .bg-image("no-result");
    }
    .text {
      margin-top: 30px;
      font-size: @font-size-medium;
      color: @color-text-d;
    }
  }
}
</style>