<template>
  <q-range
    v-model="rangeSnap"
    :min="1557135422000"
    :max="1557136059000"
    :step="60000"
    drag-range
    label
    markers
    snap
    color="primary"
  />

</template>
<script>
export default {
  name: 'MyRange',

  data () {
    return {
      rangeSnap: {
        min: 1557135422000,
        max: 1557136059000
      }
    }
  }
}

</script>
