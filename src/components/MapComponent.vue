<template>
  <div class="map" id="map"></div>
</template>

<script lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {mapGetters} from "vuex";
import Rect from "@Models/geofence/rect";
import Point from "@Models/point";
import Polygon from "@Models/geofence/polygon";
import Circle from "@Models/geofence/circle";
import Rectangle from "@Models/geofence/rectangle";
import moment from "moment";

export default {
  name: "MapComponent",
  data() {
    return {
      map: undefined,
      rectLayer: undefined,
      pointsLayer: undefined,
    }
  },
  mounted() {
    this.map = L.map('map').setView([55.15402, 61.42915], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 24,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);
  },
  watch: {
    rects: {
      handler(newRects: Rect[]) {
        if (this.map) {
          if (this.rectLayer) {
            this.rectLayer.clearLayers();
          } else {
            this.rectLayer = L.layerGroup().addTo(this.map);
          }
          newRects.forEach(rect => {
            if (rect instanceof Polygon) {
              const polygon = rect as Polygon
              const mapPolygon = L.polygon(polygon.coordinates, {color: 'green'}).addTo(this.rectLayer);
              this.map.fitBounds(mapPolygon.getBounds());
            } else if (rect instanceof Circle) {
              const circle = rect as Circle
              const mapCircle = L.circle(circle.coordinate, circle.radius, {color: "red"}).addTo(this.rectLayer);
              this.map.fitBounds(mapCircle.getBounds());
            } else if (rect instanceof Rectangle) {
              const rectangle = rect as Rectangle
              const bounds = rectangle.coordinates.map(x => bounds.extend(L.latLng(x.lat, x.lng)));
              const mapRect = L.rectangle(bounds, {color: "blue", weight: 1}).addTo(this.rectLayer);
              this.map.fitBounds(mapRect.getBounds());
            }
          })
        }
      },
      immediate: false
    },
    points: {
      handler(newPoints: Point[][]) {
        if (this.map) {
          if (this.pointsLayer) {
            this.pointsLayer.clearLayers();
          } else {
            this.pointsLayer = L.layerGroup().addTo(this.map);
          }
          newPoints.forEach(point => {
            point.forEach(point => {
              const marker = L.marker([point.lat, point.lng], {
                icon: this.customIcon,
              }).addTo(this.pointsLayer);
              marker.on('click', () => {
                marker.bindPopup(`Время прибытие: ${moment(point.date).format("DD.MM.yyyy-hh:mm")}`).openPopup();
              });
            })
            this.map.fitBounds(point.map(x => [x.lat, x.lng]));
          })
        }
      },
      immediate: false
    }
  },
  computed: {
    ...mapGetters("geofence", [
      'getAllRect'
    ]),
    ...mapGetters("transport", [
      'getAllPoints'
    ]),
    rects() {
      return this.getAllRect
    },
    points() {
      return this.getAllPoints
    },
    customIcon() {
      return L.icon({
        iconUrl: 'flags.png',
        iconSize: [24, 24],
        // Другие опции иконки (необязательно)
      });
    }
  },
}
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
}
</style>