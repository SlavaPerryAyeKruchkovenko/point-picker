<template>
  <li class="group">
    <div class="group-title">
      <input type="checkbox"/>
      <vue-feather type="folder" size="24" fill="yellow"></vue-feather>
      <span class="group-title-name">{{ group.name }}</span>
    </div>
    <ul class="s-groups">
      <group-geofence-component v-for="s_group in group.groups" :group="s_group" :key="s_group.id"/>
      <geofence-component v-for="geofence in group.data" :geofence="geofence" :key="geofence.id"/>
    </ul>
  </li>
</template>

<script>
import GeofenceComponent from "./GeofenceComponent";

export default {
  name: "GroupGeofenceComponent",
  components: {GeofenceComponent},
  props: {
    group: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.group {
  margin-top: 6px;
  width: 100%;

  .group-title {
    display: flex;
    align-items: center;

    .group-title-name {
      margin-left: 6px;
      font-size: 18px;
      font-family: "Ubuntu", sans-serif;
      line-height: normal;
      font-weight: 400;
    }
  }

  .s-groups {
    margin-left: 6px;
    display: flex;
    flex-direction: column;
  }
}
</style>