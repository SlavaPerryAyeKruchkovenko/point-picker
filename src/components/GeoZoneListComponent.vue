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
        await this.initGeofence();
        /*const schemaId = this.getSchemasOfGeofence("c929f308-f0f3-4867-bced-ebe518623b87");
        await this.initGeofenceCoordinate({
          schemaId: schemaId,
          id: "c929f308-f0f3-4867-bced-ebe518623b87"
        })
        console.log(this.getSchemas)*/
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
    ...mapActions("geofence", ["initSchemas", "initGeofence", "initGeofenceCoordinate"])
  },
  name: "GeoZoneListComponent"
}
</script>

<style scoped>

</style>