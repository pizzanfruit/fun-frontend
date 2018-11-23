<template>
  <div class="player">
    <div class="avatar">
      <img src="../assets/no_face.png">
    </div>
    <div class="name">{{player.name}}</div>
    <div
      :class="['status', player.status === 'ready' ? 'green' : 'red']"
    >{{player.status.toUpperCase()}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
import * as _ from "lodash";

import { PlayerStatus } from "@/store/modules/players";

@Component
export default class Player extends Vue {
  @Prop() public player: any;
}
</script>

<style scoped lang="scss">
.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .green {
    color: green;
  }
  .red {
    color: red;
  }
}

.name {
  font-size: 1.5rem;
  font-weight: bold;
}

.avatar {
  height: 8rem;
  width: 10rem;
  border: 5px solid black;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
