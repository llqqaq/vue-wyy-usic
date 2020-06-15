<template>
  <div class="playlist" v-show="isShow" @click="hide">
    <!-- 这里要阻止事件的冒泡 -->
    <div class="list-wrapper" @click.stop>
      <div class="list-header">
        <span class="mode iconfont" :class="getIcon" @click="togglePattern"></span>
        <span class="text">{{getText}}</span>
        <span class="del iconfont icon-trash" @click.stop="deleteAllSongs"></span>
      </div>
      <!-- 这里直接将div改为scroll -->
      <scroll :data="getSequence" :refreshDelay="refreshDelay" ref="scroll" class="list-content">
        <transition-group name="list" class="content-ul" tag="ul">
          <li
            ref="li"
            class="content-li"
            v-for="(item,index) in getSequence"
            :key="item.id"
            @click="selectItem(item,index)"
          >
            <span class="current iconfont" :class="getCurrentIndex(item)"></span>
            <span class="name">{{item.name}}</span>
            <span class="like iconfont" :class="getFavoIcon(item)" @click.stop="toggleFavoIcon(item)"></span>
            <span class="del iconfont icon-chushaixuanxiang" @click.stop="deleteOne(item)"></span>
          </li>
        </transition-group>
      </scroll>
      <div class="list-operate">
        <div class="operate-wrapper" @click="addSOng">
          <span class="add">＋</span>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="close" @click="hide">关闭</div>
    </div>
    <!-- 确定框 -->
    <confirm ref="confirm" :title="title" @confirm="confirm"></confirm>
    <!-- 添加歌曲层 -->
    <add-song ref="addSOng"></add-song>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playerMixin } from "@/common/js/mixin";
import Confirm from "@/components/confirm/confirm";
import Scroll from "@/components/scroll/scroll";
import AddSong from '@/pages/add-song/add-song'
export default {
  mixins: [playerMixin],
  name: "playlist",
  data() {
    return {
      isShow: false,
      title: "是否清空播放列表",
      refreshDelay: 100
    };
  },
  computed: {
    ...mapGetters(["getSequence", "getCurrentSong", "getMode", "getPlayList"]),
    getText() {
        console.log(this.getMode);
        return this.getMode === this.playMode.sequence ? '顺序播放' : this.getMode === this.playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
        this.scrollCurrentSong(this.getCurrentSong);
      }, 20);
    },
    hide() {
      this.isShow = false;
    },
    // 删除所有歌曲
    deleteAllSongs() {
      this.$refs.confirm.show();
    },
    // 确定删除
    confirm() {
      this.deleteAll();
      this.hide();
    },
    // 删除单一歌曲
    deleteOne(item) {
      this.deleteSong(item);
      // 当所有歌曲删完后
      if (!this.getPlayList.length) {
        this.hide();
      }
    },
    // 判断是否当前歌曲
    getCurrentIndex(item) {
      if (this.getCurrentSong.id === item.id) {
        return "icon-bofang";
      }
    },
    // 切换歌曲
    selectItem(item, index) {
      if (this.getMode === 2) {
        index = this.getPlayList.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.setPlaying(true);
    },
    // 滚动到当前播放的位置
    scrollCurrentSong(song) {
      let index = this.getSequence.findIndex(item => {
        return item.id === song.id;
      });
      this.$refs.scroll.scrollToElement(this.$refs.li[index], 300);
    },
    // 添加歌曲
    addSOng() {
        this.$refs.addSOng.show()
    },
    ...mapMutations({
      setCurrentIndex: "setCurrentIndex",
      setPlaying: "setPlaying",
      setMode: 'setMode',
      setPlayList: 'setPlayList'
    }),
    ...mapActions(["deleteSong", "deleteAll"])
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  watch: {
    //   当当前歌曲发生改变时
    getCurrentSong(newSong, oldSong) {
      if (!this.isShow || newSong.id === oldSong.id) return;
      this.scrollCurrentSong(newSong);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
@import url("~@/common/less/mixin.less");
.playlist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: @color-highlight-background;
    .list-header {
      display: flex;
      padding: 20px 30px 10px 20px;
      .mode {
        margin-right: 10px;
        font-size: 30px;
        color: @color-theme-d;
      }
      .text {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: @font-size-medium;
        color: @color-text-l;
      }
      .del {
        display: flex;
        align-items: center;
        font-size: @font-size-medium;
        color: @color-text-d;
      }
    }
  }
  .list-content {
    max-height: 240px;
    overflow: hidden;

    .content-ul {
      .content-li {
        //   直接用transition只能包裹简单元素，这个要用transition-groud，看一下样式应该放在哪里
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.3s linear;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          // 这是什么操作
          flex: 0 0 20px;
          width: 20px;
          font-size: @font-size-small;
          color: @color-theme-d;
        }
        .name {
          flex: 1;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text-d;
        }
        .like {
          margin-right: 15px;
          font-size: @font-size-small;
          color: @color-theme;
          //   喜欢的颜色
          // color: $color-sub-theme
        }
        .del {
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
    }
  }
  .list-operate {
    width: 140px;
    margin: 20px auto 30px auto;
    .operate-wrapper {
      // 个人觉得没必要flex
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border: 1px solid @color-text-l;
      border-radius: 100px;
      color: @color-text-l;
      .add {
        margin-right: 5px;
        font-size: @font-size-small-s;
      }
      .text {
        font-size: @font-size-small;
      }
    }
  }
  .close {
    text-align: center;
    line-height: 50px;
    background: @color-background;
    font-size: @font-size-medium-x;
    color: @color-text-l;
  }
}
</style>