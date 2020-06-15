<template>
  <transition name="slide">
      <music-list :title="title" :bgImage="bgImg" :songs="hotSongs" v-if="hotSongs.length>0"></music-list>
      <div class="loading" v-if="hotSongs.length<=0">
         <loading></loading>
      </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import Loading from "@/components/loading/loading";
import MusicList from '@/components/music-list/music-list'
import {getSingerInfo} from '@/api/http'
export default {
  data() {
    return {
      artist: {},
      hotSongs: []
    }
  },
  computed: {
    ...mapGetters(["getSinger"]),
    title() {
      return this.getSinger.name
    },
    bgImg() {
      return this.getSinger.avatar
    }
  },
  created() {
    // console.log(this.getSinger);
    this.getSingerInfomation()
  },
  methods: {
    // 获取歌手详情
    getSingerInfomation() {
      if(!this.getSinger){
        return
      }
      getSingerInfo(this.getSinger.id).then(res => {
        if(res.data.code === 200) {
          this.artist = res.data.artist
          this.hotSongs = res.data.hotSongs
        }
      })
    }
  },
  components: {
    MusicList,
    Loading
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");

  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
  .loading{
    position:absolute;
    top:50%;
    left:50%
  }
</style>