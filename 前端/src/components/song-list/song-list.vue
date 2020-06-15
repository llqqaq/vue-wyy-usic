<template>
  <div class="song-list">
    <ul>
      <li
        @click="select(song,index)"
        v-for="(song,index) in songs"
        :key="song.id"
        class="song-item"
      >
        <div v-show="rank" :class="getBgImg(index)" class="bg-img">{{getIndex(index)}}</div>
        <div class="content">
          <h2>{{song.name}}</h2>
          <span class="des">{{getDesc(song)}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {  
  name: "songList",
  props: {
    songs: {
      type: Array,
      default: function() {
        return [];
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log(this.songs);
  },
  methods: {
    getDesc(song) {
      let str = "";
      let al = song.al;
      let arr = song.ar;
      arr.forEach(item => {
        str = str + item.name + "/";
      });
      str = str.slice(0, str.length - 1);
      return `${str}。${al.name}`;
    },
    // 点击歌曲后派发事件
    select(song, index) {
      this.$emit("select", song, index);
    },
    // 获取相对于的背景
    getBgImg(index) {
      if (index <= 2) {
        return `icon${index}`;
      } else {
        return "text";
      }
    },
    getIndex(index) {
      if (index > 2) {
        return index++;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("~@/common/less/variable.less");
@import url("~@/common/less/mixin.less");
.bg-image(@url) {
  background-image: url("@{url}@2x.png");
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url("@{url}@3x.png");
  }
}
.song-list {
  .song-item {
    padding-top: 10px;
    margin-bottom: 10px;
    display: flex;
    .bg-img {
      width: 25px;
      height: 24px;
      background-size: 25px 24px;
      text-align: center;
      margin-right: 25px;
      &.icon0 {
        .bg-image("first");
      }
      &.icon1 {
        .bg-image("second");
      }
      &.icon2 {
        .bg-image("third");
      }
      &.text {
        color: @color-theme;
        font-size: @font-size-large;
        line-height: 24px;
      }
    }
    .content {
      flex: 1;
      h2 {
        color: @color-text;
      }
      .des {
        display: block;
        margin-top: 10px;
        color: @color-text-d;
        .no-wrap();
      }
    }
  }
}
</style>