<template>
  <li class="group">
    <div class="group-title">
      <three-state-checkbox :state="checkboxState" class="checkbox" @click="toggleAllGeofence"/>
      <vue-feather type="folder" size="24" fill="yellow"></vue-feather>
      <span class="group-title-name">{{ group.name }}</span>
    </div>
    <ul class="s-groups">
      <group-geofence-component v-for="s_group in group.groups" :group="s_group" :key="s_group.id"/>
      <geofence-component v-for="geofence in group.data" :geofence="geofence" :key="geofence.id"/>
    </ul>
  </li>
</template>

<script lang="ts">
import GeofenceComponent from "./GeofenceComponent.vue";
import {PropType} from "vue";
import Group from "@Models/group";
import Geofence from "@Models/geofence/geofence";
import CheckboxState from "@Models/checkboxState";
import {mapActions, mapGetters} from "vuex";
import ThreeStateCheckbox from "@Components/ThreeStateCheckbox.vue";
import allGeofenceHasRect from "@Helpers/hasFunctions/allGeofenceHasRect";
import someGeofenceHasRect from "@Helpers/hasFunctions/someGeofenceHasRect";


export default {
  name: "GroupGeofenceComponent",
  components: {GeofenceComponent, ThreeStateCheckbox},
  props: {
    group: {
      type: Object as PropType<Group<Geofence>>,
      required: true
    }
  },
  computed: {
    checkboxState() {
      if (allGeofenceHasRect(this.group)) {
        return CheckboxState.checked;
      } else if (someGeofenceHasRect(this.group)) {
        return CheckboxState.indeterminate;
      }
      return CheckboxState.unchecked;
    },
    ...mapGetters("geofence", [
      'getSchemasOfGeofence'
    ])
  },
  methods: {
    async toggleAllGeofence() {
      if (this.checkboxState === CheckboxState.unchecked || this.checkboxState === CheckboxState.indeterminate) {
        const schemaId = this.getSchemasOfGeofence(this.group.id);
        if (schemaId) {
          await this.initGeofenceCoordinate({
            schemaId: schemaId,
            id: this.group.id
          })
        }
      } else {
        this.removeGeofenceRect(this.group.id);
      }
    },
    ...mapActions("geofence", ["initGeofenceCoordinate", "removeGeofenceRect"])
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

    .checkbox {
      margin-right: 6px;
    }

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