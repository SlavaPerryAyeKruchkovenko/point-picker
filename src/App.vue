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
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=swap');
</style>