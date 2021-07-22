<template>
  <div id="app">
    <time-form></time-form>
    <!-- <dashboard></dashboard> -->
    <div v-if="false">
      <h1>To-Do List</h1>
      <ul>
        <to-do-form></to-do-form>
        <to-do-item
          v-for="todo in ToDoItems"
          :key="todo"
          :id="uniqueId()"
          :label="todo.label"
          :done="todo.done"
        ></to-do-item>
      </ul>
    </div>
  </div>
</template>

<script>
import ToDoItem from "./components/ToDoItem.vue";
import ToDoForm from "./components/ToDoForm";
import TimeForm from "./components/TimeForm";
import uniqueId from "lodash.uniqueid";
// import Dashboard from './components/Dashboard.vue';

export default {
  name: "App",
  components: {
    ToDoItem,
    ToDoForm,
    TimeForm,
    // Dashboard,
  },
  data() {
    return {
      ToDoItems: [
        { label: "Learn", done: false },
        { label: "Meditate", done: false },
        { label: "Exercise", done: false },
        { label: "Clean", done: false },
        { label: "Compliment", done: false },
        { label: "Stretch", done: false },
        { label: "Study", done: false },
        { label: "Call", done: false },
      ],
      uniqueId: uniqueId,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
