<template>
  <div class="transport">
    <input type="checkbox"/>
    <vue-feather type="truck" size="24" fill="blue"></vue-feather>
    <span class="group-title-name">{{ transport.name }}</span>
  </div>
</template>

<script>
import Transport from "../models/transport/transport";

export default {
  name: "TransportComponent",
  props: {
    transport: {
      type: Transport,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.transport {
  display: flex;
  align-items: center;
  margin-top: 6px;

  .group-title-name {
    margin-left: 6px;
    font-size: 18px;
    font-family: "Ubuntu", sans-serif;
    line-height: normal;
    font-weight: 400;
  }
}
</style>