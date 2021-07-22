<template>
  <div>
      <label>Current Task:</label>
    <p>{{ currentTask }}</p>
    <p>{{ taskTimeElapsed }} / {{ tasklength * 60 }}</p>
    <button @click="trackDistraction">Track Distraction</button>
    <p>{{ distractionScore }}</p>
    <button @click="markTaskSuccess">Success</button>
    <button @click="markTaskFail">Fail</button>
    <p>Started: {{ startDateTime }}</p>
    <p>{{ taskTimeElapsed }}</p>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
