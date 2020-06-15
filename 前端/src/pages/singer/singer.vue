<template>
  <div v-if="finSongers">
    <scroll
      ref="scroll"
      class="singer"
      v-if="finSongers"
      :listenScroll="listenScroll"
      @scroll="scroll"
      :probeType="probeType"
      :pullup="pullup"
      @isBottom="isBottom"
    >
      <!-- 歌手 -->
      <div>
        <div
          class="singer-item"
          v-for="firItem in finSongers"
          :key="firItem.title"
          ref="singerItem"
        >
          <h2>{{firItem.title}}</h2>
          <div
            class="item"
            v-for="secItem in firItem.items"
            :key="secItem.id"
            @click="toSingerDetail(secItem)"
          >
            <img v-lazy="secItem.avatar" alt width="80px" height="80px" />
            <span>{{secItem.name}}</span>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <ul
        class="right"
        @touchstart="onShortcutTouchStart"
        @touchmove.prevent.stop="onShortcutTouchMove"
      >
        <li
          v-for="(title,index) in shortcutList"
          :key="title"
          :data-index="index"
          ref="li"
          :class="{'choose':index === currentIndex}"
        >{{title}}</li>
      </ul>
      <!-- 固定 -->
      <div class="fixed" v-if="fix" ref="fixed">
        <h2>{{fix}}</h2>
      </div>
      <!-- 加载图 -->
      <div class="loading" v-if="!finSongers.length">
        <loading></loading>
      </div>
      <router-view></router-view>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/scroll/scroll";
import Loading from "@/components/loading/loading";
import { mapMutations } from "vuex";
import { ConvertPinyin } from "@/common/js/transform.js";
import { getSongers, getHotSongers } from "@/api/http.js";
import { playListMixin } from "@/common/js/mixin";
export default {
  mixins: [playListMixin],
  name: "singer",
  data() {
    return {
      songers: [],
      hotSongers: [],
      finSongers: [],
      scrollY: 0,
      // 滚动时的index
      currentIndex: 0,
      diff: 0,
      pullup: true
    };
  },
  created() {
    // 点击的初始位置
    this.firstPosition = "";
    // 点击的字母当前的index
    this.firstIndex = 0;
    this.listenScroll = true;
    // 每个区间高度
    this.listHeight = [];
    this.probeType = 3;

    this.getSonger();
    this.getHotSonger();
  },
  methods: {
    // mixin
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.scroll.$el.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    // 获取歌手数据
    getSonger() {
      getSongers().then(res => {
        if (res.data.code === 200) {
          this.songers = res.data.artists;
        }
      });
    },
    // 获取热门歌手数据
    getHotSonger() {
      getHotSongers().then(res => {
        if (res.data.code === 200) {
          this.hotSongers = res.data.artists;
        }
      });
    },
    // 整理数据
    allSongers() {
      let map = {
        hot: {
          title: "热门",
          items: []
        }
      };
      if (!this.hotSongers.length) {
        return;
      }
      if (!this.songers.length) {
        return;
      }
      // 将热门歌手数据放到hot里面
      this.hotSongers.forEach((item, index) => {
        if (index < 15) {
          map.hot.items.push({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url
          });
        }
      });
      // 处理歌手数据
      let temSongers = this.songers;
      temSongers.forEach(item => {
        // 返回首字母key
        let key = ConvertPinyin(item.name);
        item.key = key;
        // 判断是否存在这个首字母
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url
        });
      });
      console.log(map);
      // 将map对象内容取出放入数组
      let hot = [];
      let key = [];
      for (let item in map) {
        let value = map[item];
        if (item === "hot") {
          hot.push(value);
        } else {
          key.push(value);
        }
      }
      // 按大小排序
      key.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(key);
    },
    // 点击字母
    onShortcutTouchStart(e) {
      // 记录初始位置
      this.firstPosition = e.touches[0].pageY;
      // 这里取出来的index是个字符串
      let index = e.target.getAttribute("data-index");
      this.firstIndex = index;
      // 滚动到对应的元素位置（第二个参数是0，跳的时间）
      if (index == null) return;
      this.$refs.scroll.scrollToElement(this.$refs.singerItem[index], 0);
    },
    // 在字母上移动
    onShortcutTouchMove(e) {
      console.log("我在移动");
      let movePosition = e.touches[0].pageY;
      // 计算两者的差值并获取index
      let index = Math.floor((movePosition - this.firstPosition) / 18);
      index = parseInt(this.firstIndex) + index;
      if (index <= 0) {
        index = 0;
      }
      if (index >= this.finSongers.length - 1) {
        index = this.finSongers.length - 1;
      }
      console.log(index);
      this.$refs.scroll.scrollToElement(this.$refs.singerItem[index], 0);
    },
    // 获取每个区间的高度数组
    getListHeight() {
      this.listHeight = [];
      const list = this.$refs.singerItem;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // 滚动事件
    scroll(pos) {
      const listHeight = this.listHeight;
      // 这里判断如果是正数
      this.scrollY = pos.y;
      // 往上拉
      if (pos.y > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-this.scrollY >= height1 && -this.scrollY < height2) {
          this.currentIndex = i;
          this.diff = height2 + pos.y;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    isBottom() {
      console.log("已经到地步了");
      this.currentIndex = this.shortcutList.length - 1;
    },
    // 跳转到歌手详情页面
    toSingerDetail(singer) {
      this.$router.push(`/singer/${singer.id}`);
      this.setSinger(singer);
    },
    // 辅助函数
    ...mapMutations({
      setSinger: "setSinger"
    })
  },
  computed: {
    // 切出来字母
    shortcutList() {
      let list = [];
      if (this.finSongers) {
        this.finSongers.forEach(item => {
          if (item.title === "热门") {
            list.push("热");
          } else {
            list.push(item.title);
          }
        });
      }
      return list;
    },
    // 固定条
    fix() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.finSongers[this.currentIndex]
        ? this.finSongers[this.currentIndex].title
        : "";
    }
  },
  mounted() {
    setTimeout(() => {
      this.finSongers = this.allSongers();
    }, 500);
    // 再调用一次
    setTimeout(() => {
      this.finSongers = this.allSongers();
    }, 2000);
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    finSongers() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
        this.getListHeight();
      }, 800);
    },
    diff(newVal) {
      if (this.fix) {
        let fixedTop = newVal > 0 && newVal < 30 ? newVal - 30 : 0;
        if (this.$refs.fixed) {
          this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
        }
      }
      // let fixedTop = newVal > 0 && newVal < 30 ? newVal - 30 : 0;
      // if (this.$refs.fixed) {
      //   this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
      // }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.singer {
  position: absolute;
  top: 76px;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  .singer-item {
    h2 {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
    .item {
      padding: 20px 0 0 30px;
      span {
        margin-left: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }
  .right {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: @color-background-d;
    font-family: Helvetica;
    li {
      padding: 3px;
      &.choose {
        color: yellow;
      }
    }
  }
  .fixed {
    width: 100%;
    position: absolute;
    top: 0;
    h2 {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>