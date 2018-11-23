<template>
  <div id="app">
    <div id="top-menu">
      <Chat/>
      <PlayerInfo/>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import "@/directives";
import PlayerInfo from "@/components/PlayerInfo.vue";
import Chat from "@/components/Chat.vue";

@Component({
  components: {
    PlayerInfo,
    Chat
  }
})
export default class App extends Vue {}
</script>



<style lang="scss">
@import "~sanitize.css";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  &::-webkit-scrollbar-track {
    background-color: lightgray;
  }

  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: gray;
  }
}
*:focus {
  outline: none;
}
ul {
  list-style: none;
}
html,
body {
  width: 100%;
  height: 100%;
  font-family: "Bubblegum Sans", cursive;
  font-size: calc(15px + 0.5vw);
  min-width: 15rem;
}
#app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
}
#top-menu {
  display: flex;
}
button {
  position: relative;
  border: none;
  background: none;
  &:hover {
    font-style: italic;
    cursor: pointer;
  }
}
input,
select {
  border: solid 5px black;
  padding: 1rem;
  min-height: calc(2rem + 1.2em);
}
.error-text {
  color: red;
  font-size: 0.8em;
}
</style>
