<template>
  <router-view/>
</template>
<script>
import {mapActions} from "vuex"

export default {
  created() {
    this.loginApp();
  },
  methods: mapActions(["loginApp"])
}
</script>
<style lang="scss">
</style>
