<template>
  <div class="map" id="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
export default {
  name: "MapComponent",
  mounted() {
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);
  }
}
</script>

<style scoped lang="scss">
  .map{
    width: 100%;
    height: 100%;
  }
</style>