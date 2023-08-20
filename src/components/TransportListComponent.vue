<template>
  <div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  watch: {
    token: {
      async handler() {
        await this.initSchemas();
        await this.initDevices();

        const group = this.getSchemasOfTruck("b18a9989-d79c-4c9c-b633-4d01769c9be8");
        const truck = this.getSchemasOfTruck("afa2c6f4-4cae-4d78-962e-48d362c48af2");
        await this.initLastDayTuckCoordinate({
          id: "afa2c6f4-4cae-4d78-962e-48d362c48af2",
          schemaId: group
        })
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

<style scoped>

</style>