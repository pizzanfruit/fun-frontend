<template>
  <div class="rooms">
    <div class="grid">
      <Room v-for="room in rooms" :key="room.id" :room="room" @join="handleJoin(room.id)"/>
    </div>
    <div v-if="!rooms || rooms.length === 0" class="empty">No one's here yet.
      <br>Be the first to create a room!
    </div>
    <div class="menu">
      <button type="button" @click="createRoom">Create a new room</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapMutations } from "vuex";
import { Mutation, State, namespace } from "vuex-class";
import * as _ from "lodash";

import Room from "@/components/Room.vue";

const roomsModule = namespace("rooms");

@Component({
  components: {
    Room
  }
})
export default class Rooms extends Vue {
  @roomsModule.State("all") public rooms: any;
  @State public socket?: WebSocket;

  public async handleJoin(id: string) {
    this.joinRoom(id)
      .then(() => {
        this.$router.push({ name: "room", params: { id } });
      })
      .catch(err => {
        console.log(err);
        this.$router.push({ name: "rooms" });
      });
    const room = this.rooms.find((r: any) => r.id === id);
    // if (room && room.playerByIds.length < room.maxPlayers) {
    this.$router.push({ name: "room", params: { id } });
    // }
  }
  public createRoom() {
    this.$router.push({ name: "create-room" });
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
}
</script>

<style lang="scss" scoped>
.rooms {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.grid {
  display: grid;
  padding: 3rem 4vw;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  grid-gap: 1rem;
  margin-bottom: 3rem;
  div {
    border: solid 5px black;
  }
}
.menu {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  button {
    font-size: 2rem;
    border: 5px solid black;
    padding: 1rem;
    background-color: white;
    cursor: pointer;
  }
}
.empty {
  color: lightgrey;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  text-align: center;
}
</style>

