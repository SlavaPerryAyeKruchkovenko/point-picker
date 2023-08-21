<template>
  <ul class="transport-list">
    <li v-for="schema in this.getSchemas" :key="schema.id">
      <div class="schema">
        <vue-feather type="archive" size="24" fill="green"></vue-feather>
        <span class="schema-name">{{ schema.name }}</span>
      </div>
      <ul class="schema-groups">
        <group-transport-component v-for="group in schema.groups" :group="group" :key="group.id"/>
      </ul>
    </li>
  </ul>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import GroupTransportComponent from "@Components/GroupTransportComponent";

export default {
  components: {GroupTransportComponent},
  watch: {
    token: {
      async handler() {
        await this.initSchemas();
        await this.initDevices();
        console.log(this.getSchemas)
        /*const schemaId = this.getSchemasOfTruck("5076388d-9755-4381-8c02-2a0f9b64b5bd");
        if (schemaId){
          await this.initLastDayTuckCoordinate({
            schemaId: schemaId,
            id: "5076388d-9755-4381-8c02-2a0f9b64b5bd"
          })
        }*/
      },
      immediate: false
    }
  },
  computed: {
    ...mapGetters([
      'token',
    ]),
    ...mapGetters("transport", [
      'getSchemas',
      'getSchemasOfTruck'
    ]),
  },
  methods: {
    ...mapActions("transport", ["initSchemas", "initDevices", "initLastDayTuckCoordinate"])
  },
  name: "TransportListComponent"
}
</script>

<style scoped lang="scss">
.transport-list {
  padding: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 2px solid black;

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