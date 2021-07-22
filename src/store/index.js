import Vue from "vue";
import Vuex from "vuex";
import { firebaseDb } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const axios = require("axios").default;

// import example from "./module-example";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default new Vuex.Store({
  modules: {
    // example
  },
  state: {
    dailyProgressCount: 0,
    lastUserRecord: {},
  },
  mutations: {
    setDailyProgressCount(state, payload) {
      state.dailyProgressCount = payload.progressToDate;
    },
    incrementProgressCount(state, value) {
      state.dailyProgressCount += value;
    },
    setLastRecord(state, payload) {
      state.lastUserRecord = payload;
    },
  },
  actions: {
    addRecord: {
      root: true,
      handler(namespacedContext, value) {
        axios.post("http://localhost:3001/addRecord", value);
        // get random record id
        const recordId = uuidv4();
        firebaseDb.ref("records/" + recordId).set(value);
      },
    },
    setUserProgress: {
      root: true,
      handler(state) {
        // axios.get("http://localhost:3001/dayProgress").then((response) => {
        //   // state.commit("setDailyProgressCount", response.data);
        // });

        let records = firebaseDb.ref("records");

        var outCount = 0;
        records.once("value", (db) => {
          db.forEach((recordSnap) => {
            let midnightToday = new Date();
            midnightToday.setHours(0, 0, 0, 0);
            // const startOfDayTimestamp = midnightToday.getTime();

            let record = recordSnap.val();
            outCount += record.count;

            // alert(
            //   startOfDayTimestamp + ", " + JSON.stringify(recordSnap.val())
            // );
          });
          state.commit("setDailyProgressCount", { progressToDate: outCount });
        });

        // let records = firebaseDb.ref("records").get();
      },
    },
    incrementProgress: {
      root: true,
      handler(state, value) {
        state.commit("incrementProgressCount", value);
      },
    },
    getLastUserRecord: {
      root: true,
      handler(state) {
        axios.get("http://localhost:3001/mostRecentRecord").then((response) => {
          state.commit("setLastRecord", response.data);
        });
      },
    },
  },
  getters: {},

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING,
});
