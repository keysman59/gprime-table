<template>
  <div id="app">
    <search-table-dialog></search-table-dialog>
  </div>
</template>

<script>
import SearchTableDialog from './components/SearchTableDialog.vue'

export default {
  name: 'App-main',
  props: {

  },
  data() {
    return { 
      count: 4 
    }
  },
  components: {
    SearchTableDialog
  },
  methods: {

  }
}
</script>



<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
