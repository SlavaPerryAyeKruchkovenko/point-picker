<template>
  <div class="geofence">
    <input type="checkbox"/>
    <vue-feather type="target" size="24" fill="red"></vue-feather>
    <span class="geofence-name">{{ geofence.name }}</span>
  </div>
</template>

<script>
import Transport from "../models/transport/transport";

export default {
  name: "GeofenceComponent",
  props: {
    geofence: {
      type: Transport,
      required: true
    }
  },
  methods:{

  }
}
</script>

<style scoped lang="scss">
.geofence {
  display: flex;
  align-items: center;
  margin-top: 6px;

  .geofence-name {
    margin-left: 6px;
    font-size: 18px;
    font-family: "Ubuntu", sans-serif;
    line-height: normal;
    font-weight: 400;
  }
}
</style>