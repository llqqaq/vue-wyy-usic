<template>
  <transition name="slide">
    <div class="topList" v-if="songs.length>0">
      <music-list :bgImage="coverImgUrl" :title="title" :songs="songs" :rank='rank'></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { getGedanDetail } from "@/api/http";
import { mapGetters } from "vuex";
export default {
  name: "topList",
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  components: {
    MusicList
  },
  computed: {
    // 获取歌单名字
    title() {
      return this.getTopList.name;
    },
    coverImgUrl() {
      if (this.songs.length > 0) {
          return this.songs[0].al.picUrl
      }
      return this.getTopList.coverImgUrl;
    },
    ...mapGetters(["getTopList"])
  },
  created() {
    this.getSong();
  },
  methods: {
    //   获取歌曲数据
    getSong() {
      if (!this.getTopList.id) {
        this.$router.push("/rank");
      }
      getGedanDetail(this.getTopList.id).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.songs = res.data.playlist.tracks;
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.topList {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.4s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
}
</style>