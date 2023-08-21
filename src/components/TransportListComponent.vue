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
        /*console.log(this.getSchemas)
        const schemaId = this.getSchemasOfTruck("5076388d-9755-4381-8c02-2a0f9b64b5bd");
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

<style scoped>

</style>