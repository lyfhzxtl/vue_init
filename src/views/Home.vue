<template>
  <div id="home">
    <p id="tips">home page: hello world</p>
    <div>
      <img src="../assets/img/001.jpg" alt>
    </div>
    <div id="pathdemo"></div>
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
#home {
  #tips {
    font-size: 20px;
    font-weight: bold;
    font-style: italic;
    color: #09f;
  }
  #pathdemo {
    width: 300px;
    height: 300px;
    overflow: hidden;
    background: url("../assets/img/003.jpg");
  }
}
</style>
