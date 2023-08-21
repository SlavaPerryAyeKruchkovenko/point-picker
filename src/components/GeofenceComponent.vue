<template>
  <div class="geofence">
    <three-state-checkbox :state="checkboxState" class="checkbox" @click="viewGeofence"/>
    <vue-feather type="target" size="24" fill="red"/>
    <span class="geofence-name">{{ geofence.name }}</span>
  </div>
</template>

<script lang="ts">
import CheckboxState from "@/models/checkboxState";
import Geofence from "@Models/geofence/geofence";
import ThreeStateCheckbox from "@Components/ThreeStateCheckbox.vue";
import {defineComponent, PropType} from "vue";
import {mapActions, mapGetters} from "vuex";

export default defineComponent({
  data() {
    return {
      checkboxState: CheckboxState.unchecked
    }
  },
  watch: {
    rect(newRect) {
      if (newRect) {
        this.checkboxState = CheckboxState.checked;
      } else {
        this.checkboxState = CheckboxState.unchecked
      }
    }
  },
  components: {ThreeStateCheckbox},
  name: "GeofenceComponent",
  props: {
    geofence: {
      type: Object as PropType<Geofence>,
      required: true
    }
  },
  computed: {
    rect() {
      return this.geofence.rect
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
          await this.initGeofenceCoordinate({
            schemaId: schemaId,
            id: this.geofence.id
          })
        }
      } else {
        this.removeGeofenceRect(this.geofence.id);
      }
    },
    ...mapActions("geofence", ["initGeofenceCoordinate", "removeGeofenceRect"])
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