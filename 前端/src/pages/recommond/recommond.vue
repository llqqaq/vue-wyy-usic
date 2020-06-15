<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="playlists">
      <!-- 这里一定要有个div -->
      <div>
        <!-- 轮播图 -->
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="item in banner" :key="item.url">
            <img :src="item.imageUrl" alt style="width: 100%" @click="imgClick" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <!-- 歌单 -->
        <div class="recommond-list" v-if="banner.length>0">
          <h1 class="list-title">歌单推荐</h1>
          <div class="list-content">
            <div
              class="content-item"
              v-for="item in playlists"
              :key="item.id"
              @click="content(item)"
            >
              <img v-lazy="item.coverImgUrl" width="60" height="60" />
              <div class="item-right">
                <span class="name">{{item.name}}</span>
                <div class="count-num">
                  <span class="text">{{item.creator.nickname}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 加载图 -->
      <div class="loading" v-if="!playlists.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import Loading from "@/components/loading/loading";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getBanner, getGeDan } from "@/api/http.js";
import Scroll from "@/components/scroll/scroll";
import { playListMixin } from "@/common/js/mixin";
import { mapMutations } from "vuex";
export default {
  mixins: [playListMixin],
  name: "recommond",
  data() {
    return {
      // 轮播图配置
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay: true,
        speed: 2000,
        loop: true
      },
      // 轮播图
      banner: [],
      // 歌单
      playlists: []
    };
  },
  computed: {},
  mounted() {},
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    // 获取轮播图数据
    getBanners() {
      getBanner().then(res => {
        if (res.data.code === 200) {
          console.log(res);
          this.banner = res.data.banners;
        }
      });
    },
    // 获取推荐歌单
    getGeDans() {
      getGeDan().then(res => {
        if (res.data.code === 200) {
          this.playlists = res.data.playlists;
        }
        console.log(this.playlists);
      });
    },
    // 点击图片跳转
    imgClick() {
      console.log("点击了图片");
    },
    // 点击歌单跳转
    content(item) {
      this.$router.push(`/recommond/${item.id}`);
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: "setDisc"
    })
  },
  components: {
    swiper,
    swiperSlide,
    Loading,
    Scroll
  },
  created() {
    this.getBanners();
    this.getGeDans();
  },
  watch: {
    banner() {
      this.$refs.scroll.refresh();
    }
    // playlists() {
    //   this.refresh();
    // }
  }
};
</script>

<style lang='less' scoped>
@import url("~@/common/less/variable.less");
.recommend {
  position: absolute;
  top: 76px;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .recommond-list {
      .list-title {
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: @color-theme;
        font-size: @font-size-medium;
      }
      .list-content {
        width: 100%;
        .content-item {
          padding: 0 20px 20px 20px;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          img {
            margin-right: 20px;
          }
          .item-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .name {
              font-size: @font-size-medium;
              // color: yellow;
              line-height: 20px;
              margin-bottom: 5px;
            }
            .count-num {
              font-size: 12px;
              color: @color-text-d;
            }
          }
        }
      }
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>