<template>
  <div id="app">
    <AgoraDetector class="detector"

      @onComplete="onComplete">
    </AgoraDetector>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    onComplete(report) {
      console.log(report);
    },
  },
};
</script>

<style>
 #app {
   height: 1000px;
   margin: 0 auto;
   padding: 20px;
   background-color:burlywood;
 }
 .detector {
   margin: 0 auto;
   position: relative;
 }
</style>
