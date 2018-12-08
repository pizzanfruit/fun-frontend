<template>
  <div :class="['player', currentPlayerName === player.id ? 'current' : '']">
    <div class="avatar">
      <img src="../assets/no_face.png">
    </div>
    <div class="name">{{player.id}}</div>
    <div
      :class="['status', {green: player.statusCode === 2, yellow: player.statusCode === 1, red: player.statusCode === 0 }]"
    >{{status.toUpperCase()}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import * as _ from "lodash";

const playersModule = namespace("players");

@Component
export default class Player extends Vue {
  @Prop() public player: any;
  @playersModule.State(state => state.current.name)
  public currentPlayerName?: string;
  public get status() {
    if (this.player.statusCode === 0) {
      return "not ready";
    } else if (this.player.statusCode === 0) {
      return "selecting";
    } else if (this.player.statusCode === 2) {
      return "ready";
    } else {
      return "unknown";
    }
  }
}
</script>

<style scoped lang="scss">
.player {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  &.current {
    color: blue;
    .avatar {
      border-color: darkblue;
    }
  }
  .status {
    font-weight: bold;
  }
  .green {
    color: green;
  }
  .red {
    color: red;
  }
  .yellow {
    color: yellow;
  }
}

.name {
  font-size: 1.3rem;
  // font-weight: bold;
  text-align: center;
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
