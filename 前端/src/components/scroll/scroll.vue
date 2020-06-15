<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";

export default {
  props: {
    // 慢移动
    probeType: {
      type: Number,
      default: 1
    },
    // 允许点击,这里的点击会跟移动端的click产生冲突,会触发两次点击
    click: {
      type: Boolean,
      default: true
    },
    // 是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    // 上拉刷新
    pullup: {
      type: Boolean,
      default: false
    },
    // 滚动触发
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
        // 判断是否需要监听，派发事件
      if (this.listenScroll) {
        let me = this;
        this.scroll.on("scroll", pos => {
         
          me.$emit("scroll", pos);
          if(pos.y  === this.scroll.maxScrollY){
           this.$emit('isBottom')
          }
        });
      }
    // 当滚动到底部的时候，派发事件
      if (this.pullup) {
        console.log('我触发了')
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            console.log('满足条件')
            this.$emit("scrollToEnd");
          }
        });
      }

      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    //重新计算高度
    refresh() {
      this.scroll && this.scroll.refresh();
      console.log('我重新计算了');
      
    },
    // 滚动到对应的位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    // 滚动到对应元素
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
