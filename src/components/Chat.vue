<template>
  <div v-if="!$route.name || $route.name !== 'setup'" class="chat" v-click-outside="closeList">
    <div class="box" @click="handleBoxClick">
      Online
      <span
        style="margin-left: 0.2rem"
        :class="onlinePlayersCount > 0 ? 'green': 'red'"
      >{{onlinePlayersCount}}</span>
      <div :class="showOnlineList ? 'up caret' : 'down caret'"></div>
    </div>
    <ul v-show="showOnlineList" class="list">
      <li
        v-for="player in onlinePlayers"
        :key="player.id"
        @click="setCurrentPlayer(player.id)"
        :class="{active: currentPlayerName === player.id}"
      >{{player.id}}</li>
    </ul>
    <div class="chatbox"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";

@Component
export default class Chat extends Vue {
  @State("onlinePlayers") public onlinePlayers: any;
  public currentPlayerName: string = "";
  public showOnlineList = false;

  get onlinePlayersCount() {
    return this.onlinePlayers.length;
  }
  public handleBoxClick() {
    this.showOnlineList = !this.showOnlineList;
  }
  public setCurrentPlayer(name: string) {
    this.currentPlayerName = this.currentPlayerName === name ? "" : name;
  }
  public closeList() {
    this.showOnlineList = false;
  }
}
</script>

<style scoped lang="scss">
.caret {
  width: 0;
  height: 0;
  align-self: center;
  margin-left: auto;
  &.up {
    border-left: 0.3rem solid transparent;
    border-right: 0.3rem solid transparent;
    border-bottom: 0.3rem solid black;
  }
  &.down {
    border-left: 0.3rem solid transparent;
    border-right: 0.3rem solid transparent;
    border-top: 0.3rem solid black;
    margin-left: 0.4rem;
  }
}

.chat {
  position: fixed;
  z-index: 3;
}
.box {
  display: flex;
  border: 5px solid black;
  padding: 0.2rem 0.5rem;
  background-color: white;
  cursor: pointer;
  .green {
    color: green;
  }
  .red {
    color: red;
  }
}
.fixed {
  position: fixed;
}
.list {
  margin-top: 5px;
  border: 5px solid black;
  padding: 0.2rem 0.5rem;
  background-color: white;
  max-height: 10rem;
  overflow-y: scroll;
  li {
    padding: 0.1rem 0;
    &:hover {
      background: lightgray;
      cursor: pointer;
    }
    &.active {
      background-color: gray;
      color: white;
    }
  }
}
</style>
