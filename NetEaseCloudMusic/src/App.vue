<template lang="pug">
	div(id="app")
		router-view
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      active: "1"
    };
  }
};
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  font-size: 14px;
}
</style>
