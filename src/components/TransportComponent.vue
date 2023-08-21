<template>
  <div class="transport">
    <three-state-checkbox :state="checkboxState" class="checkbox" @click="viewTransport"/>
    <vue-feather type="truck" size="24" fill="blue"></vue-feather>
    <span class="transport-name">{{ transport.name }}</span>
  </div>
</template>

<script lang="ts">
import Transport from "../models/transport/transport";
import CheckboxState from "@Models/checkboxState";
import {mapActions, mapGetters} from "vuex";
import {PropType} from "vue";
import ThreeStateCheckbox from "@Components/ThreeStateCheckbox.vue";

export default {
  components: {ThreeStateCheckbox},
  name: "TransportComponent",
  props: {
    transport: {
      type: Object as PropType<Transport>,
      required: true
    }
  },
  computed: {
    checkboxState() {
      if (this.transport.points) {
        return CheckboxState.checked;
      } else {
        return CheckboxState.unchecked
      }
    },
    ...mapGetters("transport", [
      'getSchemasOfTruck'
    ])
  },
  methods: {
    async viewTransport() {
      if (this.checkboxState === CheckboxState.unchecked) {
        const schemaId = this.getSchemasOfTruck(this.transport.id);
        if (schemaId) {
          await this.initLastDayTuckCoordinate({
            schemaId: schemaId,
            id: this.transport.id
          })
        }
      } else {
        this.removeTransportPoints(this.transport.id);
      }
    },
    ...mapActions("transport", ["initLastDayTuckCoordinate","removeTransportPoints"])
  }
}
</script>

<style scoped lang="scss">
.transport {
  display: flex;
  align-items: center;
  margin-top: 6px;

  .checkbox {
    margin-right: 6px;
  }

  .transport-name {
    margin-left: 6px;
    font-size: 18px;
    font-family: "Ubuntu", sans-serif;
    line-height: normal;
    font-weight: 400;
  }
}
</style>