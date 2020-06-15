/* eslint-disable vue/require-v-for-key */
<template>
  <scroll class="suggest" :data="list" @scrollToEnd="toEnd" :pullup="pullup" ref="scroll" :beforeScroll="beforeScroll" @beforeScroll="scroll">
    <ul class="suggest-ul" v-show="list&&list.length >0">
      <li class="suggest-li" v-for="(item,index) in list" :key="index" @click="choose(item)">
        <div class="icon">
          <span class="iconfont icon-yinyue"></span>
        </div>
        <div class="text">
          <span class="name">{{item.name}}</span>
          <span>{{getSinger(item.artists)}}</span>
        </div>
      </li>
      <loading v-show="getMore" class="loading"></loading>
    </ul>
    <div class="no-result" v-show="!list">
      <div class="img"></div>
      <span class="text">抱歉，暂无搜索结果</span>
    </div>
  </scroll>
</template>

<script>
import { getSuggestList } from "@/api/http";
import Scroll from "@/components/scroll/scroll";
import Loading from "@/components/loading/loading";
export default {
  name: "suggest",
  data() {
    return {
      offset: 1,
      list: [],
      allCount: 0,
      pullup: true,
      getMore: false,
      getIng: true,
      beforeScroll: true
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  components: {
    Scroll,
    Loading
  },
  created() {},
  methods: {
    //   获取查询列表
    getSuggestList(keyword, offset) {
      console.log("请求调用");
      getSuggestList(keyword, offset).then(res => {
        if (res.data.code === 200) {
          if (this.getMore) {
            let arr = this.list.concat(res.data.result.songs);
            this.list = arr;
            console.log("我上面先得");
            if (this.offset * 30 >= this.allCount) {
              console.log("已经四百条了");
              this.getIng = false;
              this.getMore = false;
              return;
            }
          } else {
            console.log(res);
            this.list = res.data.result.songs;
            this.allCount = res.data.result.songCount;
            this.offset = 1;
          }
          console.log("下面");
        }
      });
    },
    // 拼接歌手
    getSinger(artists) {
      let str = "";
      artists.forEach(item => {
        str += item.name;
        str += "/";
      });
      str = str.slice(0, str.length - 1);
      return str;
    },
    // 点击歌曲
    choose(song) {
      this.$emit('chooseItem',song.name)
    },
    toEnd() {
      if (this.getIng) {
        if(!this.query) return
        console.log("已经到底部");
        this.offset++;
        this.getMore = true;
        this.getSuggestList(this.query, this.offset);
      }
    },
    // 滚动触发
    scroll() {
      this.$emit('beforeScroll')
    }
  },
  watch: {
    query(newQuery) {
      if (!this.query) {
        this.getMore = false;
        console.log("value已经变成空了");
        return;
      }
      this.$refs.scroll.scrollTo(0, 0);
      this.getMore = false;
      this.getIng = true;
      this.getSuggestList(newQuery, this.offset);
    }
  }
};
</script>

<style lang='less' scoped>
@import url("~@/common/less/variable");
@import url("~@/common/less/mixin");
.bg-image(@url){
  background-image: url('@{url}@2x.png');
  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
    background-image: url('@{url}@3x.png');
  }
}
.suggest {
  height: 100%;
  width: 100%;
  background-color: #222;
  //   padding-top: 20px;
  overflow: hidden;
  .suggest-ul {
    //   margin-top: 20px;
    .suggest-li {
      display: flex;
      align-items: center;
      margin-top: 10px;
      padding-bottom: 10px;
      .icon {
        width: 30px;
        text-align: center;
        font-size: 14px;
        color: @color-text-d;
      }
      .text {
        height: 18px;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          .no-wrap();
        }
        .name {
          margin-right: 10px;
        }
      }
    }
  }
  .no-result{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .img{
      width: 86px;
      height: 90px;
      background-size: 86px 90px;
      .bg-image('no-result')
    }
    .text{
      margin-top: 30px;
      font-size: @font-size-medium;
      color: @color-text-d;
    }
  }
}
</style>