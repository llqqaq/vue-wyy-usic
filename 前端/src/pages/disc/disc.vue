<template>
  <transition name="slide">
    <div class="disc" v-if="hotSongs.length>0">
      <music-list :title="title" :bgImage="coverImgUrl" :songs="hotSongs"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { getGedanDetail } from "@/api/http";
import { mapGetters } from "vuex";
export default {
  name: "disc",
  data() {
    return {
      hotSongs: []
    };
  },
  computed: {
    title() {
      return this.getDisc.name;
    },
    coverImgUrl() {
      return this.getDisc.coverImgUrl;
    },
    id() {
      return this.getDisc.id;
    },
    ...mapGetters(["getDisc"])
  },
  components: {
    MusicList
  },
  created() {
    this.getDetail();
    console.log(this.$route.query)
    console.log(this.$route.params.id)
  },
  methods: {
    //   获取歌单详情
    getDetail() {
        if(!this.id){
            this.$router.push('/recommond')
        }
      getGedanDetail(this.id).then(res => {
        if (res.data.code === 200) {
          this.hotSongs = res.data.playlist.tracks;
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
// .slide-enter-active,
// .slide-leave-active {
//   transition: all 0.4s;
// }
// .slide-enter,
// .slide-leave-to {
//   transform: translate3d(100%, 0, 0);
// }
.disc {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.6s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
}
</style>