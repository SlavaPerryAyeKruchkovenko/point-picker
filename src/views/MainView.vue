<template>
  <div class="main-view">
    <div class="selector-block">
      <transport-list-component/>
    </div>
    <map-component/>
  </div>
</template>

<script>
import MapComponent from "@Components/MapComponent";
import TransportListComponent from "@Components/TransportListComponent";

export default {
  name: "MainView",
  components: {TransportListComponent, MapComponent}
}
</script>

<style scoped lang="scss">
.main-view {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 1fr;
  .selector-block{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>