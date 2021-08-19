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
    last10UserRecords: {}
  },
  mutations: {
    setDailyProgressCount(state, payload) {
      state.dailyProgressCount = payload.progressToDate;
    },
    incrementProgressCount(state, value) {
      state.dailyProgressCount = state.dailyProgressCount + value;
    },
    setLastRecord(state, payload) {
      state.lastUserRecord = payload;
    },
    setLast10Records(state, payload) {
      state.last10UserRecords = payload;
    },
  },
  actions: {
    addRecord: {
      root: true,
      handler(state, record) {
        axios.post("http://localhost:3001/addRecord", record);
        let id = uuidv4();
        let Record = {...record, id: id};
        firebaseDb.ref("records/" + Record.id).set(Record);
        state.commit("setLastRecord", Record);
      },
    },
    updateProgress: {
      handler(state, record) {
        firebaseDb.ref("records/" + record.id).update(record);
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
            if (
              record.timedate > midnightToday.getTime() &&
              record.status == "success"
            ) {
              outCount += record.count;
            }
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
        // axios.get("http://localhost:3001/mostRecentRecord").then((response) => {
        //   state.commit("setLastRecord", response.data);
        // });
        var lastRecord = firebaseDb
          .ref("records")
          .orderByChild("timedate")
          .limitToLast(1);
        lastRecord.once("value", (record) => {
          state.commit("setLastRecord", record.val());
        });
      },
    },
    getLast10UserRecords: {
      root: true,
      handler(state) {
        var lastRecord = firebaseDb
          .ref("records")
          .orderByChild("timedate")
          .limitToLast(10)
          
        lastRecord.once("value", (records) => {
          let arr = [];
          records.forEach(snapshot => {
            arr.push(snapshot.val())
          })
          state.commit("setLast10Records", arr);
        });

        lastRecord.on('value', (records) => {
          let arr = [];
          records.forEach(snapshot => {
            arr.push(snapshot.val())
          })
          state.commit("setLast10Records", arr);
        })
      },
    },
  },
  getters: {},

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING,
});
