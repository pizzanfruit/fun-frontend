<template>
  <div v-if="room" class="room">
    <div class="waiting-area">
      <div class="grid">
        <Player v-for="player in allPlayers" :key="player.id" :player="player"/>
      </div>
      <div class="menu">
        <button type="button" @click="handleBack">Back</button>
        <button type="button" @click="toggleReady">Ready</button>
        <button type="button" @click="startGame">Start</button>
      </div>
    </div>
    <div class="chat">
      <div class="area">
        <ul>
          <li class="message">
            <span class="username">Username</span>:
            <span
              class="content"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deleniti quae doloribus modi quod! Esse nobis corporis veritatis odio eligendi quis eos consequuntur? Optio quis iusto repudiandae vero nulla neque.</span>
          </li>
          <li class="message">
            <span class="username">Username</span>:
            <span
              class="content"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deleniti quae doloribus modi quod! Esse nobis corporis veritatis odio eligendi quis eos consequuntur? Optio quis iusto repudiandae vero nulla neque.</span>
          </li>
          <li class="message">
            <span class="username">Username</span>:
            <span
              class="content"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deleniti quae doloribus modi quod! Esse nobis corporis veritatis odio eligendi quis eos consequuntur? Optio quis iusto repudiandae vero nulla neque.</span>
          </li>
          <li class="message">
            <span class="username">Username</span>:
            <span
              class="content"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deleniti quae doloribus modi quod! Esse nobis corporis veritatis odio eligendi quis eos consequuntur? Optio quis iusto repudiandae vero nulla neque.</span>
          </li>
          <li class="message">
            <span class="username">Username</span>:
            <span
              class="content"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deleniti quae doloribus modi quod! Esse nobis corporis veritatis odio eligendi quis eos consequuntur? Optio quis iusto repudiandae vero nulla neque.</span>
          </li>
        </ul>
      </div>
      <div class="user-input" :style="{opacity: message === '' ? 0.5 : 1}">
        <input
          v-focus
          type="text"
          placeholder="type something..."
          spellcheck="false"
          v-model="message"
        >
        <button type="button" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { mapMutations } from "vuex";
import { Getter, State, namespace } from "vuex-class";
import * as _ from "lodash";

import Player from "@/components/Player.vue";

const roomsModule = namespace("rooms");
const playersModule = namespace("players");

@Component({
  components: {
    Player
  }
})
export default class Room extends Vue {
  @roomsModule.Getter("getById") public getRoomById: any;
  @playersModule.State("allInRoom") public allPlayers: any;
  @playersModule.Action("getAllInRoomInfo") public getAllPlayersInfo: any;
  public room: any = {};
  public message: string = "";

  @Watch("$route.params.id")
  public onRouteUpdate() {
    this.loadRoom();
  }

  public created() {
    this.loadRoom();
  }
  public loadRoom() {
    this.room = this.getRoomById(this.$route.params.id);
    this.getAllPlayersInfo(this.room.playersById);
  }

  public toggleReady() {
    // asd
  }

  public startGame() {
    // asd
  }

  public sendMessage() {
    //
  }

  public handleBack() {
    this.$router.push({ name: "rooms" });
  }
}
</script>

<style lang="scss" scoped>
$colors: red, orange, green, blue, purple;
$break-small: 950px;

.room {
  display: flex;
  height: 100%;
  margin-top: 2rem;
  @media screen and (max-width: $break-small) {
    overflow-y: auto;
    flex-direction: column;
    height: inherit;
  }
}

.waiting-area {
  flex: 1;
  z-index: 2;
  height: 100%;
  overflow-y: auto;
  position: relative;
  @media screen and (max-width: $break-small) {
    flex: none;
    height: auto;
  }
  .grid {
    display: grid;
    padding: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    grid-template-rows: 10rem;
    grid-auto-rows: 10rem;
    grid-gap: 1rem;
    margin-bottom: 1rem;
  }
  .menu {
    position: absolute;
    display: flex;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    @media screen and (max-width: $break-small) {
      position: relative;
      flex-direction: column;
    }
    button {
      display: inline-block;
      margin: 0.2rem 1rem;
      width: 10rem;
      font-size: 2rem;
      border: 5px solid black;
      padding: 1rem;
      background-color: white;
      cursor: pointer;
    }
  }
}

.chat {
  display: flex;
  flex-direction: column;
  width: 20rem;
  height: 100%;
  @media screen and (max-width: $break-small) {
    width: 100%;
    display: block;
    .area {
      height: 40rem;
    }
  }
  .area {
    flex: 1;
    border: 5px black solid;
    padding: 0 0.5rem;
    overflow-y: auto;
    @for $i from 1 through length($colors) {
      .message:nth-child(#{length($colors)}n + #{$i}) {
        .username {
          color: nth($colors, $i);
        }
      }
    }
    .message {
      border-bottom: 2px solid lightgray;
      padding: 0.5rem 0;
    }
  }
  .user-input {
    display: flex;
    input {
      flex: 1;
      border-top: 0;
    }
    button {
      padding: 0 1rem;
      border-bottom: 5px solid black;
      border-right: 5px solid black;
    }
  }
}
</style>

