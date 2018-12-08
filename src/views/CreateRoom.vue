<template>
  <div class="create-room">
    <div>
      <button class="back-button" @click="handleBack">Back</button>
    </div>
    <div class="title">Create your own room</div>
    <div v-show="errorMessage" class="error-text">{{errorMessage}}</div>
    <div>Pick a room name</div>
    <input
      v-focus
      type="text"
      :placeholder="`e.g. ${playerName}'s room`"
      spellcheck="false"
      v-model="roomName"
      :style="{opacity: roomName === '' ? 0.5 : 1}"
      :maxlength="MAX_ROOM_NAME_LENGTH"
    >
    <div>Set max number of players</div>
    <select v-model="maxPlayers" :style="{opacity: maxPlayers === '' ? 0.5 : 1}">
      <option disabled :value="0">Pick one</option>
      <option :value="2">2 players</option>
      <option :value="3">3 players</option>
      <option :value="4">4 players</option>
    </select>
    <div>Choose a map</div>
    <select v-model="roomType" :style="{opacity: roomType === '' ? 0.5 : 1}">
      <option disabled value>Choose one</option>
      <option value="1">The Mirage Lake</option>
      <option value="2">The Timeless Country</option>
      <option value="3">The Mammoth Land</option>
      <option value="-1">I don't know. Anything!</option>
    </select>
    <div class="create-button">
      <button @click="handleCreate">Create</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapMutations } from "vuex";
import { Action, State, namespace, Mutation } from "vuex-class";
import * as _ from "lodash";

import { MAX_ROOM_NAME_LENGTH } from "@/config";
import { Room } from "@/store/modules/rooms";

const roomsModule = namespace("rooms");
const playersModule = namespace("players");

@Component
export default class CreateRoom extends Vue {
  @Mutation("setGlobalLoading") public setGlobalLoading: any;
  @playersModule.State(state => state.current.name) public playerName: any;
  // @roomsModule.Action("createAsync") public createRoom: any;
  @State public socket?: WebSocket;
  public roomName: string = "";
  public maxPlayers: number = 0;
  public roomType: string = "";
  public errorMessage: string = "";
  public MAX_ROOM_NAME_LENGTH = MAX_ROOM_NAME_LENGTH;

  public handleBack() {
    this.$router.push({ name: "rooms" });
  }

  public async handleCreate() {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    try {
      this.setGlobalLoading(true);
      const newRoomId = await this.createRoom({
        name: this.roomName,
        maxPlayers: this.maxPlayers,
        type: this.roomType
      });
      await this.joinRoom(newRoomId);
      this.setGlobalLoading(false);
      this.$router.push({ name: "room", params: { id: newRoomId } });
    } catch (err) {
      console.log(err);
      this.setGlobalLoading(false);
      this.$router.push({ name: "setup" });
    }
  }

  private validate() {
    if (!(this.roomName && this.maxPlayers && this.roomType)) {
      this.setErrorMessage("You need to complete all fields!");
      return false;
    }
    if (this.roomName.length > MAX_ROOM_NAME_LENGTH) {
      this.setErrorMessage(
        `Enter a room name shorter than ${MAX_ROOM_NAME_LENGTH} characters!`
      );
      return false;
    }
    return true;
  }

  private async joinRoom(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        return;
      }
      // Create room
      socket.send(
        JSON.stringify({
          type: "join-room",
          payload: { id }
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

  private async createRoom(room: Room): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        return;
      }
      // Create room
      socket.send(
        JSON.stringify({
          type: "create-room",
          payload: room
        })
      );
      socket.addEventListener(
        "message",
        event => {
          try {
            const res = JSON.parse(event.data);
            if (res.type === "success" && res.payload) {
              resolve(res.payload);
            } else {
              reject(res.payload);
            }
          } catch (err) {
            console.error("Can't parse server's response!");
            reject(err);
          }
        },
        { once: true }
      );
    });
  }

  private setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  private clearError() {
    this.errorMessage = "";
  }
}
</script>

<style lang="scss" scoped>
.create-room {
  padding: 2rem;
  align-self: center;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 1.5rem;
  div {
    margin: 10px 0;
  }
  .title {
    font-size: 2rem;
  }
}
input,
select {
  width: 100%;
}
.create-button {
  align-self: flex-end;
}
</style>

