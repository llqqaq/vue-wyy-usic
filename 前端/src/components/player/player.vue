<template>
  <div class="player" v-if="getPlayList.length>0">
    <transition name="normal">
      <div class="normal-playing" v-show="getFullScreen">
        <!-- 背景图片 -->
        <div class="background">
          <img :src="getCurrentSong.al.picUrl" alt width="100%" height="100%" />
        </div>
        <!-- 头 -->
        <div class="top">
          <span class="iconfont icon-xiangxia" @click="hide"></span>
          <h1 class="title">{{getCurrentSong.name}}</h1>
          <div class="artist">{{getDesc(getCurrentSong)}}</div>
        </div>
        <!-- 中 -->
        <div
          class="middle-wrapper"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend.prevent="middleTouchEnd"
        >
          <!-- 图片 -->
          <div class="middle" ref="middleImg">
            <div class="middle-zw">
              <div class="middle-w" :class="getPlaying?'play':'play pause'">
                <img :src="getCurrentSong.al.picUrl" alt />
              </div>
            </div>
            <!-- 歌词 -->
            <div class="lyric">{{currentLyric}}</div>
          </div>
          <!-- 歌词 -->
          <scroll class="lyric-wrapper" :data="lyric.lines" v-if="lyric" ref="scroll">
            <div v-if="lyric">
              <p
                ref="lyricP"
                v-for="(line,index) in lyric.lines"
                :key="index"
                :class="{'current': currentLineNum ===index}"
              >{{line.txt}}</p>
            </div>
          </scroll>
        </div>
        <!-- 尾 -->
        <div class="bottom">
          <!-- 标志点 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="link">
            <span class="current">{{_format(currentTime)}}</span>
            <div class="progress-bar" @click="clickProgress">
              <div class="bar-inner" ref="barInner">
                <div class="progress" ref="progress"></div>
                <div
                  class="progress-btn"
                  ref="progressBtn"
                  @touchstart.prevent="progressTouchStart"
                  @touchmove.prevent="progressTouchMove"
                  @touchend.prevent="progressTouchEnd"
                ></div>
              </div>
            </div>
            <span class="duration">{{_format(duration)}}</span>
          </div>
          <div class="operate">
            <div class="sequence" @click="togglePattern">
              <span
                class="iconfont"
                :class="getIcon"
              ></span>
            </div>
            <div class="prev" :class="isready?'':'disable'">
              <span @click="prev" class="iconfont icon-shangyishou"></span>
            </div>
            <div class="zting-play" @click="togglePlay" :class="isready?'':'disable'">
              <span
                class="iconfont"
                :class="getPlaying?'icon-zanting':'icon-bofang'"
              ></span>
            </div>
            <div class="next" :class="isready?'':'disable'">
              <span @click.stop="next" class="iconfont icon-xiayishou"></span>
            </div>
            <div class="aixin">
              <!-- <span class="iconfont icon-like"></span> -->
              <span class="iconfont" :class="getFavoIcon(getCurrentSong)" @click.stop="toggleFavoIcon(getCurrentSong)"></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-playing" v-show="!getFullScreen" @click="open">
        <div class="mini-img" :class="getPlaying?'play':'play pause'">
          <img :src="getCurrentSong.al.picUrl" width="40px" height="40px" alt />
        </div>
        <div class="text">
          <span class="name">{{getCurrentSong.name}}</span>
          <span class="artist">{{getDesc(getCurrentSong)}}</span>
        </div>
        <div class="icon">
          <div class="play" @click.stop="togglePlay">
            <span
              class="iconfont"
              :class="getPlaying?'icon-zanting':'icon-bofang'"
            ></span>
          </div>
          <div class="choose" @click.stop="showPlaylist">
            <span class="iconfont icon-shunxubofang"></span>
          </div>
        </div>
      </div>
    </transition>
    <!-- 歌单 -->
    <playlist ref="playlist"></playlist>
    <!-- canplay是audio加载好触发的事件-->
    <audio
      ref="audio"
      :src="url"
      @canplay="ready"
      error="error"
      @timeupdate="timeupdate"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations,mapActions } from "vuex";
// import { shuffle } from "@/common/js/util.js";
import { getLyric } from "@/api/http";
import Scroll from "@/components/scroll/scroll.vue";
import Lyric from "lyric-parser";
import Playlist from "@/components/playlist/playlist";
import {playerMixin} from "@/common/js/mixin.js"
export default {
  mixins: [playerMixin],
  data() {
    return {
      url: "",
      isready: false,
      currentTime: 0,
      duration: 0,
      
      // 歌词
      lyric: null,
      // 当前歌词行
      currentLineNum: 0,
      // 标志位
      currentShow: "cd",
      currentLyric: ""
    };
  },
  computed: {
    ...mapGetters([
      "getFullScreen",
      "getPlayList",
      "getSequence",
      "getCurrentSong",
      "getPlaying",
      "getCurrentIndex",
      "getMode",
      'getPlayHistory'
    ]),
    
  },
  methods: {
    // 切换出歌单
    showPlaylist() {
      this.$refs.playlist.show();
    },
    // 播放完毕
    end() {
      if (this.getMode === this.playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 播放器缩小
    hide() {
      this.setFullScreen(false);
    },
    ...mapMutations({
      setFullScreen: "setFullScreen",
      setPlaying: "setPlaying",
      setCurrentIndex: "setCurrentIndex",
      setMode: "setMode",
      setPlayList: "setPlayList"
    }),
    getDesc(song) {
      let str = "";
      let arr = song.ar;
      arr.forEach(item => {
        str = str + item.name + "/";
      });
      str = str.slice(0, str.length - 1);
      return `${str}`;
    },
    // 切换播放状态
    togglePlay() {
      if (!this.isready) {
        return;
      }
      this.setPlaying(!this.getPlaying);
      // 切换歌词状态
      if (this.lyric) {
        this.lyric.togglePlay();
      }
    },
    // 打开播放器
    open() {
      this.setFullScreen(true);
    },
    // 下一首
    next() {
      if (this.getPlayList.length === 1) {
        this.loop();
        this.setPlaying(true)
      } else {
        if (this.isready) {
          let index = this.getCurrentIndex + 1;
          console.log(index);
          console.log(this.getPlayList.length);
          if (index === this.getPlayList.length) {
            index = 0;
            console.log("我是最后一首");
          }
          this.setCurrentIndex(index);
          this.setPlaying(true);
          this.isready = false;
        }
      }
    },
    // 上一首
    prev() {
      if (this.getPlayList.length === 1) {
        this.loop();
        this.setPlaying(true)

      } else {
        if (this.isready) {
          let index = this.getCurrentIndex - 1;
          console.log(index);
          if (index === -1) {
            index = this.getPlayList.length - 1;
          }
          this.setCurrentIndex(index);
          this.setPlaying(true);
          this.isready = false;
        }
      }
    },
    // audio准备好
    ready() {
      this.isready = true;
      // 将歌曲传到本地和播放历史中
      this.savePlayHistory(this.getCurrentSong)
      console.log(this.getPlayHistory);
    },
    error() {
      this.isready = true;
    },
    // 按钮拖动
    progressTouchStart(e) {
      this.touch.drag = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.progressWidth = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      this.touch.distance = e.touches[0].pageX - this.touch.startX;
      let offsetWidth = Math.min(
        this.progress.barWidth,
        Math.max(0, this.touch.progressWidth + this.touch.distance)
      );
      this._offwidth(offsetWidth);
      console.log(this.$refs.progress.clientWidth);
    },
    progressTouchEnd() {
      this._triggerPercent();
      if (!this.getPlaying) {
        this.togglePlay();
      }
      this.touch.drag = false;
    },
    // 点击播放条
    clickProgress(e) {
      // const progressLeft = this.$refs.barInner.offsetLeft
      // rect对象里面有该元素的top,left,bottom,left,width,height
      // console.log(this.$refs.barInner.offsetHeight);
      // console.log(this.$refs.barInner.offsetWidth);
      const rect = this.$refs.barInner.getBoundingClientRect();
      const offsetX = e.pageX - rect.left;

      // 获取点击元素的偏移量e.offsetX
      // console.log(e.offsetX);
      this._offwidth(offsetX);
      this._triggerPercent();
    },
    // audio播放事件
    timeupdate(e) {
      this.currentTime = e.target.currentTime;
      this.duration = e.target.duration;
    },
    // 获取播放百分比,设置播放进度
    _triggerPercent() {
      let percent = this.$refs.progress.clientWidth / this.progress.barWidth;
      this.$refs.audio.currentTime = this.duration * percent;
      // 歌词进度改变
      if (this.lyric) {
        this.lyric.seek(this.$refs.audio.currentTime * 1000);
      }
    },
    // 格式化时间
    _format(time) {
      // 向下取整
      time = time | 0;
      let minute = (time / 60) | 0;
      let second = this._pad(time % 60);
      return `${minute}:${second}`;
    },
    // 添加位数
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    _offwidth(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    },
    
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      // 将歌词调到第一句
      if (this.lyric) {
        this.lyric.seek(0);
      }
    },
    //获取歌词
    getLyrics(id) {
      getLyric(id)
        .then(res => {
          if (res.data.code === 200) {
            let txt = res.data.lrc.lyric;
            this.lyric = new Lyric(txt, this.callback);
            // 判断是否播放中，调用play
            if (this.getPlaying) {
              this.lyric.play();
            }
          }
        })
        .catch(() => {
          this.currentLyric = "";
          this.lyric = null;
          this.currentLineNum = 0;
        });
    },
    // 歌词实例的回调函数
    // eslint-disable-next-line no-unused-vars
    callback({ lineNum, txt }) {
      // console.log(lineNum);
      this.currentLineNum = lineNum;
      // console.log(this.currentLineNum);
      if (lineNum > 5) {
        // 到第六个开始滚动
        let pObj = this.$refs.lyricP[lineNum - 5];
        this.$refs.scroll.scrollToElement(pObj, 1000);
      } else {
        this.$refs.scroll.scrollTo(0, 0, 1000);
      }
      this.currentLyric = txt;
    },
    // middle滚动
    middleTouchStart(e) {
      this.middleTouch.initiaied = true;
      let touch = e.touches[0];
      this.middleTouch.startX = touch.pageX;
      this.middleTouch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      console.log("持续触发");
      if (!this.middleTouch.initiaied) {
        return;
      }
      let touch = e.touches[0];
      const deltaX = touch.pageX - this.middleTouch.startX;
      const deltaY = touch.pageY - this.middleTouch.startY;
      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }
      // 处于哪一边
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.middleTouch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.scroll.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.scroll.$el.style["transitionDuration"] = 0;
      // 设置透明度
      this.$refs.middleImg.style.opacity = 1 - this.middleTouch.percent;
      this.$refs.middleImg.style.transitionDuration = 0;
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.middleTouch.percent > 0.3) {
          console.log("cd够了");
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          console.log("cd不够");
          opacity = 1;
          offsetWidth = 0;
        }
      } else {
        if (this.middleTouch.percent < 0.8) {
          console.log("lyric够了");
          offsetWidth = 0;
          opacity = 1;
          this.currentShow = "cd";
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          console.log("lyric不够");
        }
      }
      const time = 300;
      this.$refs.scroll.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.middleImg.style.opacity = opacity;
      // 使用transition-duration进行动画效果
      this.$refs.scroll.$el.style["transitionDuration"] = `${time}ms`;
      this.$refs.middleImg.style["transitionDuration"] = `${time}ms`;
    },
    ...mapActions([
      'savePlayHistory'
    ])
  },
  created() {
    // 拖动数据
    this.touch = {};
    // 滑动条
    this.progress = {};
    // 中间滚动数据
    this.middleTouch = {};
  },
  watch: {
    // 歌曲发生改变
    getCurrentSong(newsong, oldsong) {
      if (!newsong.id || newsong.id === oldsong.id) return;
      console.log(newsong);
      this.url = `https://music.163.com/song/media/outer/url?id=${newsong.id}.mp3`;
      setTimeout(() => {
        this.$refs.audio.play();
      }, 500);
      // 先清理之前的lyric对象
      if (this.lyric) {
        this.lyric.stop();
      }
      // 获取歌词
      this.getLyrics(newsong.id);
    },
    // 播放状态发生改变
    getPlaying() {
      const audio = this.$refs.audio;
      if (audio) {
        this.$nextTick(() => {
          this.getPlaying ? audio.play() : audio.pause();
        });
      }
    },
    // 歌曲播放时间
    currentTime(time) {
      let percent = time / this.duration;
      if (percent >= 0 && !this.touch.drag) {
        // 获取盒子宽度用clientWidth
        this.progress.barWidth =
          this.$refs.barInner.clientWidth - this.$refs.progressBtn.clientWidth;
        // 设置盒子宽度用Width
        let offsetWidth = percent * this.progress.barWidth;
        this._offwidth(offsetWidth);
      }
    }
  },
  components: {
    Scroll,
    Playlist
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.player {
  .normal-playing {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      width: 100%;
      position: relative;
      margin-bottom: 25px;
      .iconfont {
        position: absolute;
        left: 6px;
        top: 9px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
      .title {
        text-align: center;
        line-height: 40px;
        font-size: @font-size-large;
        color: @color-text;
      }
      .artist {
        text-align: center;
        line-height: 20px;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .middle-wrapper {
      // width: 100%;
      // position: absolute;
      // top: 80px;
      // bottom: 155px;
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      // 左
      .middle {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        box-sizing: border-box;
        .middle-zw {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 100%;
          .middle-w {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            // 旋转效果
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              // 停止旋转
              animation-play-state: paused;
            }
            img {
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .lyric {
          margin-top: 30px;
          width: 100%;
          text-align: center;
          height: 20px;
          line-height: 20px;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
      }
      // 右边
      .lyric-wrapper {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        div {
          p {
            text-align: center;
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current {
              color: @color-text;
            }
          }
        }
      }
    }
    .bottom {
      touch-action: none;
      position: absolute;
      bottom: 50px;
      width: 100%;
      // font-size: 0;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: @color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
      .link {
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .current {
          color: @color-text;
          font-size: @font-size-small;
          line-height: 30px;
          width: 40px;
          text-align: center;
        }
        .progress-bar {
          flex: 1;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          .bar-inner {
            position: relative;
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.3);
            .progress {
              width: 0px;
              height: 100%;
              background: @color-theme;
            }
            .progress-btn {
              position: absolute;
              top: -5px;
              width: 9px;
              height: 9px;
              border: 2px solid @color-text;
              border-radius: 50%;
              background: @color-theme;
            }
          }
        }
        .duration {
          color: @color-text;
          font-size: @font-size-small;
          line-height: 30px;
          width: 40px;
          text-align: center;
        }
      }
      .operate {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 0 60px;
        span {
          font-size: 30px;
          color: @color-theme-d;
        }
        .next{
          .iconfont{
            font-size: 27px;
          }
        }
        .sequence {
          width: 26px;
          box-sizing: border-box;
          span {
            font-size: 26px;
            &.icon-danquxunhuan,
            &.icon-shunxubofang {
              font-size: 23px;
            }
          }
        }
        .zting-play {
          span {
            font-size: 45px;
          }
        }
        .disable {
          span {
            color: @color-theme-d;
          }
        }
        .aixin {
          font-size: 26px;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.5s;
      .top,
      .bottom {
        transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
      .middle {
        transition: all 2s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
      .middle {
        opacity: 0;
      }
    }
  }
  .mini-playing {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 150;
    height: 60px;
    background-color: @color-highlight-background;
    box-sizing: border-box;
    padding: 10px 5px 10px 15px;
    display: flex;
    font-display: row;
    font-size: 0;
    .mini-img {
      img {
        border-radius: 50%;
      }
      // 旋转效果
      &.play {
        animation: rotate 20s linear infinite;
      }
      &.pause {
        // 停止旋转
        animation-play-state: paused;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      padding-left: 10px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      .name {
        font-size: @font-size-medium;
        color: @color-text;
        margin-bottom: 2px;
      }
      .artist {
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
    .icon {
      display: flex;
      flex-direction: row;
      font-size: 0;
      height: 100%;
      .iconfont {
        font-size: 40px;
        color: @color-theme-d;
      }
      .play,
      .choose {
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-bofang-yuanshijituantubiao {
          font-size: 45px;
        }
        .icon-danquxunhuan,
        .icon-shunxubofang {
          font-size: 35px;
        }
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100px, 0);
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>