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
      :maxlength="MAX_PLAYER_NAME_LENGTH"
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
import axios from "axios";

import {
  ERRORS,
  MAX_PLAYER_NAME_LENGTH,
  BACKEND_URL,
  BACKEND_WS
} from "@/config";

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
  @Mutation("setGlobalLoading") public setGlobalLoading: any;
  @State public socket?: WebSocket;
  @Mutation public setSocket: any;
  public MAX_PLAYER_NAME_LENGTH = MAX_PLAYER_NAME_LENGTH;

  private name: string = "";
  private errorMessage: string = "";

  public mounted() {
    sessionStorage.removeItem("pepper-session-playerName");
    this.setPlayerName("");
    if (this.socket) {
      this.socket.close();
    }
    this.setSocket(undefined);
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
      this.setGlobalLoading(true);
      const player = await this.registerPlayerByName(this.name);
      await this.connectAsPlayer(player.name, player.password);
      this.setGlobalLoading(false);
    } catch (err) {
      this.setGlobalLoading(false);
      this.showConnectionError(err);
      return;
    }
    this.$router.push({ name: "rooms" });
  }

  private async registerPlayerByName(name: string) {
    const res = await axios.post(`${BACKEND_URL}/players`, {
      name
    });
    return res.data;
  }

  private async connectAsPlayer(name: string, password: string) {
    // Create WebSocket connection.
    const socket = new WebSocket(BACKEND_WS);
    this.setSocket(socket);
    /// Connection opened
    socket.addEventListener("open", event => {
      socket.send(
        JSON.stringify({
          name,
          password
        })
      );
    });

    // Listen for messages
    socket.addEventListener("close", event => {
      this.setGlobalLoading(false);
      console.log("Closing message from server ", event);
      this.$router.push({ name: "setup" });
    });
  }

  private showConnectionError(error: any) {
    if (error.response && error.response.data === "AlreadyExists") {
      this.setErrorMessage("Name already taken. Pick something else!");
    } else {
      this.setErrorMessage(error.message);
    }
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

