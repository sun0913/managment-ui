<template>
  <div class="logo-box" :class="{'width':configure.isCollapse}">
    <div v-if="configure.isCollapse" class="logo-content">
      <img class="logo-img logo-txt" src="@/assets/awit.ico" alt="">
    </div>
    <div v-else class="logo-content">
      <img class="logo-img" src="@/assets/awit.ico" alt="">
      <span class="logo-txt ml5">爱维特项目管理系统</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {storeToRefs} from 'pinia'
import {useConfigStoreHook} from "@/store/modules/config";

const {configure} = storeToRefs(useConfigStoreHook())
</script>

<style lang="scss" scoped>
.logo-img{
  width: 50px;
  height: 18px;
}
.logo-box{
  width: 220px;
  &.width{
    width: 64px;
  }
  .logo-content{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .logo-txt{
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    animation: logoAnimation .3s ease;
  }
}
@keyframes logoAnimation {
  0%{
    transform: scale(0);
  }
  80%{
    transform: scale(1.2);
  }
  100%{
    transform: scale(1);
  }
}
</style>
