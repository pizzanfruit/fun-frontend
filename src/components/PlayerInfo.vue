<template>
  <div v-if="$route.name !== 'setup'" class="player-info">
    <div class="greetings">
      Hi,
      <span class="blue">{{playerName}}</span>
    </div>
    <div class="menus">
      <button type="button" @click="handleChangeName">Change name</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation, namespace } from "vuex-class";

const playersModule = namespace("players");

@Component
export default class PlayerInfo extends Vue {
  @playersModule.State(state => state.current.name) public playerName: any;
  public handleChangeName() {
    this.$router.push({ name: "setup" });
  }
}
</script>

<style scoped lang="scss">
.player-info {
  display: flex;
  flex-direction: column;
  margin-left: auto;
}
.menus button {
  text-decoration: underline;
}

.blue {
  color: blue;
}
</style>
