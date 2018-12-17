<template>
  <div>
    <p id="tips">home page: hello world</p>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    this.$http.get('/home/sounds/201812/17/catalog_1545037247.json').then(({ data }) => {
      console.log(data);
    })
  }
}
</script>

<style lang="scss">
#tips {
  font-size: 20px;
  font-weight: bold;
  font-style: italic;
  color: #09f;
}
</style>
