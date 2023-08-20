<template>
  <div>

  </div>
</template>

<script>
import {mapActions,mapGetters} from "vuex";

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
    ])
  },
  methods: {
    ...mapActions("transport",["initSchemas","initDevices"])
  },
  name: "TransportListComponent"
}
</script>

<style scoped>

</style>