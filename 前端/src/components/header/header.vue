<template>
    <div class="header-wrapper">
        <div class="icon"></div>
        <div class="text">Chicken Music</div>
        <span class="center" @click="toCenter">中</span>
    </div>
</template>

<script>
export default {
    name: 'm-header',
    methods: {
        toCenter() {
            this.$router.push('/user')
        }
    }
}
</script>

<style lang="less" scoped>
@import url('~@/common/less/variable.less');
.bg-image(@url){
  background-image: url('@{url}@2x.png');
  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
    background-image: url('@{url}@3x.png');
  }
}
.header-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: @color-theme;
    position: relative;
    .icon{
        width: 30px;
        height: 32px;
        .bg-image('logo');
        background-size: 30px 32px;
        margin-right: 10px;
    }
    .text{
        font-size: @font-size-large;
    }
    .center{
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
    }
}
</style>