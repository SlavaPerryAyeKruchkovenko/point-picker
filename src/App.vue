<template>
  <router-view/>
</template>
<script>
import {mapActions} from "vuex"

export default {
  async created() {
    await this.loginApp();
  },
  methods: {
    ...mapActions(["loginApp"])
  }
}
</script>