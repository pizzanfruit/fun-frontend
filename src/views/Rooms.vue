<template>
  <div class="rooms">
    <div class="grid">
      <Room v-for="room in rooms" :key="room.id" :room="room" @join="joinRoom(room.id)"/>
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

  public joinRoom(id: string) {
    this.$router.push({ name: "room", params: { id } });
  }
  public createRoom() {
    this.$router.push({ name: "create-room" });
  }
}
</script>

<style lang="scss" scoped>
.rooms {
  display: flex;
  flex-direction: column;
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
</style>

