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