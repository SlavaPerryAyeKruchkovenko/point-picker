<template>
  <div class="main-view">
    <map-component/>
    <transport-list-component class="transport-list"/>
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
  height: 100vh;
  width: 100vw;

  .transport-list {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>