<style>
  #app{
    position :absolute;
    height: 100%;
    width :100%;
  }

</style>
<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->

      <router-view></router-view>


  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>


