<template>
  <div id="app">
    <router-view v-if="isRouterAlive" ref="route"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  }
}
</script>

<style>
html, body, #app, .el-container {
  /*统一设置高度为100%*/
  margin: 0;
  height: 100%;
}
label {
  color: #909498;
}
</style>
