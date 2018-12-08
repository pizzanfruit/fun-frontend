<template>
  <div v-show="showGlobalLoading" class="loading">
    <img src="../assets/loading.svg">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class PlayerInfo extends Vue {
  @State public showGlobalLoading?: boolean;
}
</script>

<style scoped lang="scss">
.loading {
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  z-index: 3;
  img {
    height: 4rem;
    width: 4rem;
  }
}
</style>
