<template>
  <div class="layout-container">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { routerparams } from "@/core/mixins/routerp";
export default {
  mixins: [routerparams],
};
</script>