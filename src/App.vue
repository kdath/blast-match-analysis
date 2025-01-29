<template>
  <div id="background">
    <div id="wrapper">
      <GameSummary />
      <RoundSummary />
    </div>
  </div>
</template>

<script lang="ts">
import GameSummary from './components/GameSummary.vue'
import RoundSummary from './components/RoundSummary.vue'

export default {
  name: 'App',
  components: {
    GameSummary,
    RoundSummary,
  },
}
</script>

<style>
@font-face {
  font-family: 'Radion';
  font-weight: normal;
  font-style: normal;
  src: url('~@/assets/fonts/RadionA-BlackItalic.woff') format('woff');
}
@font-face {
  font-family: 'TT Norms pro';
  font-weight: 400;
  font-style: normal;
  src: url('~@/assets/fonts/TT-norms-pro-regular.woff') format('woff');
}

body {
  height: 100vh;
  margin: 0;
  padding: 0px;
  width: 100%;
  background-color: #1e0a18;
}
#wrapper {
  display: flex;
  height: 100%;
  margin: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
}

#background {
  background-image: url('./assets/header.png');
  min-height: 100vh;
  background-size: cover;
}

.header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 32px;
  gap: 20px;
}

.title {
  font-size: 36px;
  font-style: italic;
  line-height: 26px;
  font-weight: 900;
  text-transform: uppercase;
  font-family: Radion;
  color: white;
}

.subtitle {
  font-size: 20px;
  font-style: italic;
  letter-spacing: 6px;
  line-height: 20px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: Radion;
  color: #fffe3e;
}

</style>
