<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="isShow">
      <div class="wrapper">
        <div class="confirm-content">
          <div class="title">{{title}}</div>
          <div class="content">
            <span class="left" @click.stop="cancel">{{ cancelBtn }}</span>
            <span @click.stop="confirm">{{ confirmBtn }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "confirm",
  data() {
    return {
      isShow: false
    };
  },
  props: {
    title: {
      type: String,
      default: "是否清空所有搜索历史"
    },
    cancelBtn: {
      type: String,
      default: "取消"
    },
    confirmBtn: {
      type: String,
      default: "确定"
    }
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    cancel() {
      this.isShow = false;
      this.$emit("cancel");
    },
    confirm() {
      this.isShow = false;
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/common/less/variable.less");
.confirm {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 998;
  background-color: @color-background-d;
  &.confirm-fade-enter-active {
    animation: confirm-fadein 2s;
    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // padding: 10px 20px 8px 20px;
    background: @color-highlight-background;
    .confirm-content {
      width: 270px;

      .title {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: @font-size-large;
        color: @color-text-l;
      }
      .content {
        width: 100%;
        span {
          padding: 10px 0;
          display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 22px;
          border-top: 1px solid @color-background-d;
          color: @color-text-d;
          font-size: @font-size-large;
          box-sizing: border-box;
          &.left {
            border-right: 1px solid @color-background-d;
          }
        }
      }
    }
  }
}
// 了解使用这玩意
@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>