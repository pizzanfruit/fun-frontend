<template>
  <div class="create-room">
    <button class="back-button" @click="handleBack">Back</button>
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
    >
    <div>Set max number of players</div>
    <select v-model="maxPlayers" :style="{opacity: maxPlayers === '' ? 0.5 : 1}">
      <option disabled value="">Pick one</option>
      <option value="2">2 players</option>
      <option value="3">3 players</option>
      <option value="4">4 players</option>
    </select>
    <div>Choose a map</div>
    <select v-model="mapCode" :style="{opacity: mapCode === '' ? 0.5 : 1}">
      <option disabled value="">Choose one</option>
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
import { Action, State, namespace } from "vuex-class";
import * as _ from "lodash";
import { MAX_ROOM_NAME_LENGTH } from "@/config";

const roomsModule = namespace("rooms");
const playersModule = namespace("players");

@Component
export default class CreateRoom extends Vue {
  @playersModule.State(state => state.current.name) public playerName: any;
  @roomsModule.Action("createAsync") public createRoom: any;
  public roomName: string = "";
  public maxPlayers: string = "";
  public mapCode: string = "";
  public errorMessage: string = "";

  public handleBack() {
    this.$router.push({ name: "rooms" });
  }

  public async handleCreate() {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    const newRoomId = await this.createRoom({
      name: this.roomName,
      maxPlayers: this.maxPlayers,
      mapCode: this.mapCode
    });
    this.$router.push({ name: "room", params: { id: newRoomId } });
  }

  private validate() {
    if (!(this.roomName && this.maxPlayers && this.mapCode)) {
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

