<template>
  <li class="group">
    <div class="group-title">
      <three-state-checkbox :state="checkboxState" class="checkbox" @click="toggleAllTransport"/>
      <vue-feather type="folder" size="24" fill="yellow"></vue-feather>
      <span class="group-title-name">{{ group.name }}</span>
    </div>
    <ul class="s-groups">
      <group-transport-component v-for="s_group in group.groups" :group="s_group" :key="s_group.id"/>
      <transport-component v-for="transport in group.data" :transport="transport" :key="transport.id"/>
    </ul>
  </li>
</template>

<script lang="ts">

import TransportComponent from "@Components/TransportComponent.vue";
import ThreeStateCheckbox from "@Components/ThreeStateCheckbox.vue";
import {PropType} from "vue";
import Group from "@Models/group";
import Transport from "@Models/transport/transport";
import CheckboxState from "@Models/checkboxState";
import {mapActions, mapGetters} from "vuex";
import allTransportsHasPoints from "@Helpers/hasFunctions/allTransportsHasPoints";
import someTransportsHasRect from "@Helpers/hasFunctions/someTransportsHasPoints";

export default {
  name: "GroupTransportComponent",
  components: {TransportComponent, ThreeStateCheckbox},
  props: {
    group: {
      type: Object as PropType<Group<Transport>>,
      required: true
    }
  },
  computed: {
    checkboxState() {
      if (allTransportsHasPoints(this.group)) {
        return CheckboxState.checked;
      } else if (someTransportsHasRect(this.group)) {
        return CheckboxState.indeterminate;
      }
      return CheckboxState.unchecked;
    },
    ...mapGetters("transport", [
      'getSchemasOfTruck'
    ])
  },
  methods: {
    async toggleAllTransport() {
      if (this.checkboxState === CheckboxState.unchecked || this.checkboxState === CheckboxState.indeterminate) {
        const schemaId = this.getSchemasOfTruck(this.group.id);
        if (schemaId) {
          await this.initLastDayTuckCoordinate({
            schemaId: schemaId,
            id: this.group.id
          })
        }
      } else {
        this.removeTransportPoints(this.group.id);
      }
    },
    ...mapActions("transport", ["initLastDayTuckCoordinate", "removeTransportPoints"])
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