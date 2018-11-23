<template>
  <div class="room">
    <div class="name-text">{{room.name}}</div>
    <div
      :class="['status', roomStatus]"
    >{{roomStatus.charAt(0).toUpperCase() + roomStatus.slice(1)}}</div>
    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error sunt in iusto quibusdam ducimus quaerat neque, iure at, nostrum tenetur, eligendi earum fugit? Autem, nobis in maxime repellendus ullam nulla?</div>
    <div class="bottom">
      <div class="join-button">
        <button v-show="roomStatus==='available'" type="button" @click="this.$emit('join')">JOIN</button>
      </div>
      <div
        class="player-count-text"
      >{{room.playersById.length}}/{{room.maxPlayers || DEFAULT_MAX_PLAYERS}} player(s)</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
import * as _ from "lodash";

@Component
export default class Room extends Vue {
  @State("DEFAULT_MAX_PLAYERS") public DEFAULT_MAX_PLAYERS: any;
  @Prop() public room: any;

  get roomStatus() {
    const { statusCode } = this.room;
    if (statusCode === 0) {
      return "available";
    }
    if (statusCode === 1) {
      return "full";
    }
    if (statusCode === 2) {
      return "on-going";
    }
    return statusCode;
  }
}
</script>

<style scoped lang="scss">
.room {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  .name-text {
    font-weight: bold;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
  }
  .status {
    &.available {
      color: green;
    }
    &.full {
      color: orange;
    }
    &.on-going {
      color: red;
    }
  }
}

.join-button button {
  color: blue;
}
</style>
