<template>
  <div class="checkbox">
    <vue-feather type="check" size="16" fill="white" v-if="this.state === 0"/>
    <vue-feather type="square" size="16" fill="gray" stroke="none" v-if="this.state === 2"/>
  </div>
</template>

<script lang="ts">

export default {
  data() {
    return {
      checked: false,
      CheckboxState: {
        checked: 'checked',
        indeterminate: 'indeterminate',
        unchecked: 'unchecked'
      }
    }
  },
  name: "three-state-checkbox",
  props: {
    state: {
      type: Number,
      required: true
    }
  },
}
</script>

<style scoped lang="scss">
.checkbox {
  transition: all 300ms ease-out;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 6px;
  cursor: pointer;
}
</style>