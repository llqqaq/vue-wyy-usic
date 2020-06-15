<template>
  <div class="music-list">
    <!-- 上 -->
    <div class="header-wrapper" :style="bgSty" ref="hWrapper">
      <div class="header">
        <span class="iconfont icon-fanhui" @click="back"></span>
        <h1>{{title}}</h1>
      </div>
      <!-- 播放 -->
      <div class='play' ref="play" v-if="songs.length>0" @click="sequencePlay"> 
        <span class="iconfont icon-bofang"></span>
        <span class="text">随机播放全部</span>
      </div>
    </div>
    <div class="fill" ref="fill"></div>
    <!-- 下 -->
    <scroll ref="scroll" class="scroll" :click="click" :data="songs" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll">
      <div class="s-wrapper">
        <song-list :songs="songs" :rank="rank" @select="select"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from "@/components/song-list/song-list";
import Scroll from "@/components/scroll/scroll";
import {mapActions} from 'vuex'
import {playListMixin} from '@/common/js/mixin.js'
// import Loading from '@/components/loading/loading';
export default {
  // 插入mixin
  mixins: [playListMixin], 
  data() {
    return {
      imageHeight: 0,
      probeType: 3,
      listenScroll: true,
      scrollY: 0,
      click: false
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    },
    rank:{
      type:Boolean,
      default: false
    }
  },
  computed: {
    bgSty() {
      return `background-image: url(${this.bgImage})`;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.hWrapper.clientHeight
    this.$refs.scroll.$el.style.top = `${this.imageHeight}px`
    console.log(this.title);
    console.log(this.bgImage);
    console.log(this.songs);
  },
  components: {
    SongList,
    Scroll
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 点击随机播放
    sequencePlay() {
      console.log('我触发了');
      this.randomPlay({
        list: this.songs
      })
    },
    // 返回上一层
    back() {
      this.$router.back()
    },
    select(song,index) {
      // console.log(song,index);
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // mixin
    handlePlayList(playList) {
      console.log(playList);
      const bottom = playList.length>0?'60px': ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      // console.log(newY)
      let zIndex = 0
      let imgHeight = -this.imageHeight + 55
      let scrollY = Math.max(imgHeight,newY)
      let scale = 1
      let percent = Math.abs(newY/this.imageHeight)
      this.$refs.fill.style.transform = `translateY(${scrollY}px)`
      if(newY <= imgHeight) {
        // console.log(this.$refs.hWrapper.clientHeight)
        zIndex = 10
        this.$refs.hWrapper.style.paddingTop = 0
        this.$refs.hWrapper.style.height = 55+'px'
        this.$refs.play.style.display='none'
      }else{
        // zIndex = 0
        this.$refs.hWrapper.style.paddingTop = '70%'
        this.$refs.hWrapper.style.height = 0
        this.$refs.play.style.display=''
      }
      if(newY > 0) {
        zIndex = 10
        scale = 1 + percent
      }
      this.$refs.hWrapper.style.transform = `scale(${scale})`
      this.$refs.hWrapper.style.zIndex = zIndex

    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: @color-background;
  .header-wrapper {
    // width: 100%;
    // height: 250px;
    // background-size: cover;
    // 设置盒子根据宽度改变高度
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    // 背景图铺满
    background-size: cover;
    // z-index:50; 
    .header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .iconfont {
        color: @color-theme;
        font-size: @font-size-large-x;
        font-weight: 900;
        position: absolute;
        top: 0px;
        left: 6px;
        padding: 10px;
      }
      h1 {
        font-weight: 900;
        text-align: center;
        line-height: 40px;
        font-size: @font-size-large;
        color: @color-text;
      }
    }
    .play{
      position: absolute;
      bottom:20px;
      left: 50%;
      transform: translateX(-50%);
      border: 1px solid @color-theme;
      color: @color-theme;
      width: 135px;
      text-align: center;
      padding:7px 0;
      border-radius:30px;
      z-index: 60;
      .iconfont{
        margin-right: 6px;
        font-size: @font-size-medium-x;
        vertical-align: middle;
      }
      .text{
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
  }
  // 屏幕大小
  .fill{
    position: relative;
    height: 100%;
    background: @color-background;
  }
  .scroll{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // overflow: hidden;
    .s-wrapper{
      padding: 20px 30px;
    }
    .loading{
       position: absolute;
       top: 30%;
       left: 50%;
       transform: translate(-50%, -50%);
    }
  }
}
// .wrapper {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: 99;
//   background-color: @color-background;
// }
// .newcenter {
//   width: 100%;
//   background: url("../../common/images/timg.png") no-repeat;
//   background-size: 100% auto;
//   padding-top: 70%;
//   height: 0px;
// }
</style>