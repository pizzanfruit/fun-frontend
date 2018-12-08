<template>
  <div v-if="room" class="room">
    <div class="waiting-area">
      <div class="grid">
        <Player v-for="player in allPlayers" :key="player.id" :player="player"/>
      </div>
      <div class="menu">
        <button type="button" @click="handleBack">Back</button>
        <button
          type="button"
          :class="toggleReadyLabel.toLowerCase()"
          @click="toggleReady"
        >{{toggleReadyLabel}}</button>
        <button type="button" @click="startGame">Start</button>
      </div>
    </div>
    <div class="chat">
      <div class="area">
        <ul>
          <li v-for="(msg, index) in chat.messages" :key="index" class="message">
            <span class="username">{{msg.playerName}}</span>:
            <span class="content">{{msg.content}}</span>
          </li>
          <li
            v-if="!chat.messages || chat.messages.length === 0"
            class="empty"
          >Nothing here yet. Be the first to speak up!</li>
        </ul>
      </div>
      <div class="user-input" :style="{opacity: message === '' ? 0.5 : 1}">
        <input
          v-focus
          type="text"
          placeholder="type something..."
          spellcheck="false"
          v-model="message"
          @keyup.enter="sendMessage"
          maxlength="100"
        >
        <button type="button" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { mapMutations } from "vuex";
import { Getter, State, Mutation, namespace } from "vuex-class";
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
  @Mutation("setGlobalLoading") public setGlobalLoading: any;
  @roomsModule.Mutation("appendChat") public appendChat: any;
  @roomsModule.Mutation("setCurrentId") public setCurrentRoomId: any;
  @roomsModule.Action("setCurrentChat") public setCurrentRoomChat: any;
  @roomsModule.Getter("current") public room: any;
  @roomsModule.State("currentChat") public chat: any;
  @playersModule.Getter("allInRoom") public allPlayers: any;
  @playersModule.State(state => state.current.name) public playerName: any;
  @State public socket?: WebSocket;
  public message: string = "";

  public get currentStatusCode() {
    return this.allPlayers.find((p: any) => p.id === this.playerName)
      .statusCode;
  }

  public get toggleReadyLabel() {
    if (this.currentStatusCode === 0) {
      return "Ready";
    } else {
      return "Unready";
    }
  }

  public updated() {
    if (this.room) {
      this.setGlobalLoading(false);
    }
    const chatArea = this.$el.querySelector(".chat .area");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

  @Watch("$route.params.id")
  public onRouteUpdate() {
    this.loadRoom();
  }

  public created() {
    this.loadRoom();
  }
  public async loadRoom() {
    this.setGlobalLoading(true);
    this.setCurrentRoomId(this.$route.params.id);
    this.setCurrentRoomChat();
  }

  public async toggleReady() {
    try {
      if (this.currentStatusCode === 0) {
        await this.setStatusCode(2);
      } else {
        await this.setStatusCode(0);
      }
    } catch (err) {
      console.log(err);
      this.$router.push({ name: "setup" });
    }
  }

  public startGame() {
    // asd
  }

  public sendMessage() {
    if (!this.message) {
      return;
    }
    // Eagerly append chat
    this.appendChat({ playerName: this.playerName, content: this.message });
    this.send(this.message);
    this.message = "";
  }

  public async handleBack() {
    this.leaveRoom().catch(err => {
      console.log(err);
      this.$router.push({ name: "setup" });
    });
    this.$router.push({ name: "rooms" });
  }

  private async setStatusCode(statusCode: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        return;
      }
      // Create room
      socket.send(
        JSON.stringify({
          type: "change-status",
          payload: { statusCode }
        })
      );
      socket.addEventListener(
        "message",
        event => {
          try {
            const res = JSON.parse(event.data);
            if (res.type === "success") {
              resolve();
            } else {
              reject(res.payload);
            }
          } catch (err) {
            // tslint:disable-next-line:no-console
            console.error("Can't parse server's response!");
            reject(err);
          }
        },
        { once: true }
      );
    });
  }

  private async leaveRoom(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        return;
      }
      // Create room
      socket.send(
        JSON.stringify({
          type: "leave-room"
        })
      );
      socket.addEventListener(
        "message",
        event => {
          try {
            const res = JSON.parse(event.data);
            if (res.type === "success") {
              resolve();
            } else {
              reject(res.payload);
            }
          } catch (err) {
            // tslint:disable-next-line:no-console
            console.error("Can't parse server's response!");
            reject(err);
          }
        },
        { once: true }
      );
    });
  }

  private async send(message: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        return;
      }
      // Create room
      socket.send(
        JSON.stringify({
          type: "chat-in-room",
          payload: { message }
        })
      );
      socket.addEventListener(
        "message",
        event => {
          try {
            const res = JSON.parse(event.data);
            if (res.type === "success") {
              resolve();
            } else {
              reject(res.payload);
            }
          } catch (err) {
            // tslint:disable-next-line:no-console
            console.error("Can't parse server's response!");
            reject(err);
          }
        },
        { once: true }
      );
    });
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
    // grid-template-rows: 10rem;
    // grid-auto-rows: 10rem;
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
      &.ready {
        background-color: green;
        color: white;
      }
      &.unready {
        background-color: red;
        color: white;
      }
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
    .empty {
      color: lightgrey;
      font-size: 1.2rem;
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

