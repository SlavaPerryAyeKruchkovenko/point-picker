<template>
  <div class="main-view">
    <div class="selector-block">
      <transport-list-component class="data-list"/>
      <geo-zone-list-component class="data-list"/>
    </div>
    <map-component class="map"/>
  </div>
</template>

<script>
import MapComponent from "@Components/MapComponent";
import TransportListComponent from "@Components/TransportListComponent";
import GeoZoneListComponent from "@Components/GeofenceListComponent";

export default {
  name: "MainView",
  components: {GeoZoneListComponent, TransportListComponent, MapComponent}
}
</script>

<style scoped lang="scss">
.main-view {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .selector-block {
    display: flex;
    height: 50%;
    width: 100%;

    .data-list {
      background: #f6f8fa;
      max-width: 50%;
      max-height: 100%;
      overflow: auto;
    }
  }

  .map {
    width: 100%;
    height: 50%;
  }
}
</style>