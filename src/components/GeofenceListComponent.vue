<template>
  <ul class="geofence-list">
    <li v-for="schema in this.getSchemas" :key="schema.id">
      <div class="schema">
        <vue-feather type="archive" size="24" fill="green"></vue-feather>
        <span class="schema-name">{{ schema.name }}</span>
      </div>
      <ul class="schema-groups">
        <group-geofence-component v-for="group in schema.groups" :group="group" :key="group.id"/>
      </ul>
    </li>
  </ul>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import GroupGeofenceComponent from "@Components/GroupGeofenceComponent";

export default {
  components: {GroupGeofenceComponent},
  watch: {
    token: {
      async handler() {
        await this.initSchemas();
        await this.initGeofence();
      },
      immediate: false
    }
  },
  computed: {
    ...mapGetters([
      'token',
    ]),
    ...mapGetters("geofence", [
      'getSchemas',
      'getSchemasOfGeofence'
    ])
  },
  methods: {
    ...mapActions("geofence", ["initSchemas", "initGeofence"])
  },
  name: "GeoZoneListComponent"
}
</script>

<style scoped lang="scss">
.geofence-list {
  padding: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 2px solid black;
  border-left: none;

  .schema {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .schema-name {
      margin-left: 6px;
      font-size: 18px;
      font-family: "Ubuntu", sans-serif;
      line-height: normal;
      font-weight: 400;
    }
  }

  .schema-groups {
    display: flex;
    flex-direction: column;
    margin-left: 6px;
  }
}
</style>