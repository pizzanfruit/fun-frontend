<template>
  <div class="setup" @keyup.enter="handleNext">
    <div>Pick a name</div>
    <input
      v-focus
      type="text"
      placeholder="e.g. Pepperoni Papaya"
      spellcheck="false"
      v-model="name"
      :style="{opacity: name === '' ? 0.5 : 1}"
      @input="clearError"
    >
    <div v-show="errorMessage" class="error-text">{{errorMessage}}</div>
    <div class="btn-group">
      <button type="button" @click="randomizeName">Randomize</button>
      <button type="button" @click="handleNext">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapMutations } from "vuex";
import { Mutation, State, namespace } from "vuex-class";
import * as _ from "lodash";

import { ERRORS, MAX_PLAYER_NAME_LENGTH } from "@/config";

const playersModule = namespace("players");

const PRESET_NAMES = [
  "Geppert Royston",
  "Damian Wheatleigh",
  "Walmund Peddle",
  "Castor Dalton",
  "Theodoric Brownrigg",
  "Noe Royal",
  "Jobst Altham",
  "Osvaldo Sydney",
  "Aldridge Alvingham",
  "Freddy Lindsay"
];

@Component
export default class Setup extends Vue {
  @playersModule.Mutation("setCurrentName") public setPlayerName: any;
  private name: string = "";
  private errorMessage: string = "";

  public mounted() {
    this.setPlayerName("");
  }

  private async handleNext() {
    const error = this.validateName(this.name);
    if (error) {
      if (error === ERRORS.MissingRequiredItem) {
        this.setErrorMessage("Enter something dude!");
      } else if (error === ERRORS.MaxLengthExceeded) {
        this.setErrorMessage(
          `Enter something shorter than ${MAX_PLAYER_NAME_LENGTH} characters!`
        );
      }
      return;
    }
    this.setPlayerName(this.name);
    try {
      await this.connectAsPlayer(this.name);
    } catch (err) {
      this.showConnectionError(err);
      return;
    }
    this.$router.push({ name: "rooms" });
  }

  private async connectAsPlayer(name: string) {
    // Create WebSocket connection.
    const socket = new WebSocket("ws://localhost:3000/ws");
    /// Connection opened
    socket.addEventListener("open", event => {
      socket.send("Hello Server!");
    });

    // Listen for messages
    socket.addEventListener("message", event => {
      // console.log("Message from server ", event.data);
    });
  }

  private showConnectionError(error: Error) {
    // console.error("Connection error!", error);
  }

  private setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  private clearError() {
    this.errorMessage = "";
  }

  private validateName(name: string) {
    if (!name) {
      return ERRORS.MissingRequiredItem;
    }
    if (name.length > MAX_PLAYER_NAME_LENGTH) {
      return ERRORS.MaxLengthExceeded;
    }
    return null;
  }

  private randomizeName() {
    this.name = _.sample(_.difference(PRESET_NAMES, this.name)) as string;
  }
}
</script>

<style lang="scss" scoped>
.setup {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 1.5rem;
  div {
    margin: 10px 0;
  }
}

input {
  font-size: 1.5rem;
}

.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

