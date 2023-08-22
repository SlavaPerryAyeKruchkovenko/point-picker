<template>
  <div class="geofence">
    <three-state-checkbox :state="checkboxState" class="checkbox" @click="viewGeofence"/>
    <vue-feather type="target" size="24" fill="red"/>
    <span class="geofence-name">{{ geofence.name }}</span>
  </div>
</template>

<script lang="ts">
import CheckboxState from "@Models/checkboxState";
import Geofence from "@Models/geofence/geofence";
import ThreeStateCheckbox from "@Components/ThreeStateCheckbox.vue";
import {defineComponent, PropType} from "vue";
import {mapActions, mapGetters} from "vuex";

export default defineComponent({
  components: {ThreeStateCheckbox},
  name: "GeofenceComponent",
  props: {
    geofence: {
      type: Object as PropType<Geofence>,
      required: true
    }
  },
  computed: {
    checkboxState() {
      if (this.geofence.rect) {
        return CheckboxState.checked;
      } else {
        return CheckboxState.unchecked
      }
    },
    ...mapGetters("geofence", [
      'getSchemasOfGeofence'
    ])
  },
  methods: {
    async viewGeofence() {
      if (this.checkboxState === CheckboxState.unchecked) {
        const schemaId = this.getSchemasOfGeofence(this.geofence.id);
        if (schemaId) {
          await this.addGeofenceCoordinate({
            schemaId: schemaId,
            id: this.geofence.id
          })
        }
      } else {
        this.removeGeofenceRect(this.geofence.id);
      }
    },
    ...mapActions("geofence", ["addGeofenceCoordinate", "removeGeofenceRect"])
  }
})
</script>

<style scoped lang="scss">
.geofence {
  display: flex;
  align-items: center;
  margin-top: 6px;

  .checkbox {
    margin-right: 6px;
  }

  .geofence-name {
    margin-left: 6px;
    font-size: 18px;
    font-family: "Ubuntu", sans-serif;
    line-height: normal;
    font-weight: 400;
  }
}
</style>