<template>
  <scroll class="rank-wrapper" :data="rankList" ref="scroll">
      <!-- 这里记得要一个div -->
    <div>
      <div class="rank-item" v-for="list in rankList" :key="list.id" @click="choose(list)">
        <div class="item-img">
          <img :src="list.coverImgUrl" width="100" height="100" />
        </div>
        <div class="item-song">
          <span v-for="(song,index) in list.tracks" :key="song.first">{{++index}}、{{song.first}}</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </scroll>

</template>

<script>
import { getRankingList } from "@/api/http";
import Scroll from "@/components/scroll/scroll";
import {mapMutations} from 'vuex'
export default {
  name: "rank",
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this.rankingList();
  },
  components: {
    Scroll
  },
  methods: {
    // 获取排行榜数据
    rankingList() {
      getRankingList().then(res => {
        if (res.data.code === 200) {
          this.rankList = res.data.list;
        //   setTimeout(() => {
        //     this.$refs.scroll.refresh();
        //   }, 500);
        }
      });
    },
    // 点击歌单跳转
    choose(list) {
      this.$router.push(`/rank/${list.id}`)
    //   将歌单数据传入vuex
        this.setTopList(list)
    },
    ...mapMutations({
        setTopList: 'setTopList'
    })
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.rank-wrapper {
  position: absolute;
  top: 76px;
  left: 0;
  right: 0;
  bottom: 0;
  // overflow: hidden;
  padding: 0px 20px;
  overflow: hidden;
  .rank-item {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    .item-song {
      flex: 1;
      background: @color-highlight-background;
      display: flex;
      flex-direction: column;
      //   padding: 20px 0 20px 20px;
      padding: 0 20px;
      justify-content: center;
      color: @color-text-d;
      font-size: @font-size-small;
      line-height: 26px;
    }
    &:last-child {
      padding-bottom: 20px;
    }
  }
}
</style>