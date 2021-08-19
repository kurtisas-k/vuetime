<template>
  <div style="display: flex;">
    <div
      id="app"
      style="
        display: flex;
        flex-direction: column;
      "
    >
      <div v-if="!active">
        <h3>What are you working on right now?</h3>
        <label for="taskdescription">Description:</label>
        <input
          type="text"
          id="current-task-description"
          name="taskdescription"
          autocomplete="off"
          v-model="taskDescription"
        />
        <br />
        <label for="tasklength" align="left">Time:</label>
        <input
          type="text"
          id="current-task-length"
          name="tasklength"
          v-model="taskLength"
        />
        <br />
        <button @click="markTaskStart(taskDescription, taskLength)">
          Start
        </button>
      </div>
      <div v-if="active" style="align-self: flex-start">
        <h3>Current task:</h3>
        <p>{{ taskDescription }}</p>
        <h4>Task time elapsed/Time left in iteration</h4>
        <p>{{ taskTimeElapsed }} / {{ taskLength * 60 }}</p>
        <button @click="trackDistraction">Track Distraction</button>
        <p>{{ distractionScore }}</p>
        <button @click="markTaskSuccess">Success</button>
        <button @click="markTaskFail">Fail</button>
        <p>Started: {{ startDateTime }}</p>
        <p>{{ taskTimeElapsed }}</p>
      </div>
      <div style="align-self: center">
        <p>Session Time: {{ sessionTimeElapsed }}</p>
        <p>Session Progress: {{ culmulativeTaskTime }}</p>
        <p>Daily Progress Time : {{ dailyProgressCount }}</p>
      </div>

      <!-- <button @click="start">Start</button>
    <button @click="stop">Stop</button>
    <button @click="reset">Reset</button> -->
    </div>
    <div
      style="
        display: flex;
        flex-direction: column;
      "
    >
      <table>
        <tr v-for="record in last10UserRecords" :key="record.id">
          <td>{{record.name}}</td>
          <td>{{record.description}}</td>
          <td>{{record.status}}</td>
          <td>{{record.count}}</td>
          <td>{{new Date(record.timedate).toLocaleString()}}</td>


        </tr>
      </table>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";

export default {
  data() {
    return {
      sessionTimer: undefined,
      taskTimer: undefined,
      startDateTime: {},
      distractionScore: 0,
      active: false,
      taskDescription: "",
      taskLength: 0,
      taskTimeElapsed: 0,
      sessionTimeElapsed: 0,
      dayLength: 10 * 60 * 60 * 0.5,
      culmulativeTaskTime: 0,
    };
  },
  methods: {
    noActiveTask: function() {
      if (
        this.$store.state.lastUserRecord.status == "started" &&
        this.$store.state.lastUserRecord.timedate < Date().setHours(0, 0, 0, 0)
      ) {
        console.log("abandoned task detected");
      }
    },
    startCounting: function() {
      var v = this;
      var now = new Date();
      v.startDateTime = now;
      this.sessionTimer = setInterval(() => {
        v.sessionTimeElapsed += 1;
      }, 1000);
    },
    trackDistraction: function() {
      this.distractionScore += 1;
    },
    markTaskStart: function() {
      this.active = true;
      this.$store.dispatch("addRecord", {
        status: "started",
        started: new Date(),
        sessionTimeElapsed: 0,
        timedate: new Date().getTime(),
        description: this.taskDescription,
        length: this.taskLength,
      });
      this.taskTimer = setInterval(() => {
        this.taskTimeElapsed += 1;
      }, 1000);
    },
    markTaskSuccess: function() {
      clearInterval(this.taskTimer);
      this.culmulativeTaskTime += this.taskTimeElapsed;
      this.updateProgress({
        id: this.lastUserRecord.id,
        status: "success",
        count: this.taskTimeElapsed,
        sessionTime: this.sessionTimeElapsed,
        timedate: new Date().getTime(),
        description: this.taskDescription,
        length: this.taskLength,
      });
      this.resetTaskTime();
    },
    markTaskFail: function() {
      clearInterval(this.taskTimer);
      this.resetTaskTime();
      this.updateProgress({
        status: "fail",
        count: this.taskTimeElapsed,
        sessionTime: this.sessionTimeElapsed,
        timedate: new Date().getTime(),
      });
    },
    resetTaskTime: function() {
      this.taskTimeElapsed = 0;
      this.active = false;
    },
    track: function(record) {
      this.$store.dispatch("incrementProgress", record.count);
    },
    updateProgress: function(record) {
      this.$store.dispatch("updateProgress", record);
    },
  },
  mounted() {
    this.startCounting();
  },
  created() {
    this.$store.dispatch("setUserProgress");
    this.$store.dispatch("getLastUserRecord");
    this.$store.dispatch("getLast10UserRecords");
  },
  computed: {
    dailyProgressCount: {
      get: function() {
        return this.$store.state.dailyProgressCount;
      },
    },
    lastUserRecord: {
      get: function() {
        return this.$store.state.lastUserRecord;
      },
    },
    last10UserRecords: {
      get: function() {
        return this.$store.state.last10UserRecords;
      },
    },
  },
};
</script>

<style>
input[type="text"],
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="submit"] {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #45a049;
}

div {
  border-radius: 5px;
  background-color: lightblue;
  padding: 20px;
}

label {
  color: hsl(221, 37%, 50%);
  font-weight: bold;
}

button {
  font-size: 24px;
  background-color: #506dac;
  color: white;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}


</style>
