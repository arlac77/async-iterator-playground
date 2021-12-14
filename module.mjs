import { aggregateFifo } from "aggregate-async-iterator";
import { sequence } from "./util.mjs";

async function worker() {
  const model = initializeModel();

  async function processMaster(model) {
    for await (const m of model.master) {
      console.log(m);
    }
  }

  async function processDetails(model) {
    for await (const d of model.details) {
      console.log(d);
    }
  }

  await Promise.all([processMaster(model), processDetails(model)]);
  //await Promise.all([processDetails(model)]);
  //await Promise.all([processMaster(model)]);
}

worker();

function initializeModel() {
  const masters = new Set();

  let startDetails;

  const details = [
    emptyWaitIterator(new Promise(resolve => (startDetails = resolve)))
  ];

  async function* master() {
    for (const m of masters) {
      yield m;
    }

    for await (const m of sequence("M")) {
      startDetails();
      masters.add(m);
      details.push(sequence(`${m}D`, 50));
      yield m;
    }
  }

  return {
    masters,
    master: master(),
    details: aggregateFifo(details)
  };
}

function emptyWaitIterator(start) {
  return {
    async next() {
      console.log("await start");
      await start;
      console.log("start details");

      return { done: true };
    }
  };
}

class Sequenzer {
  constructor(name, time = 100, num = 5, errIndex = -1) {
    this.name = name;
    this.time = time;
    this.num = num;
    this.errIndex = errIndex;
  }

  async *[Symbol.asyncIterator]() {
    for (let i = 0; i < this.num; i += 1) {
      yield new Promise((resolve, reject) =>
        setTimeout(() => {
          if (i === this.errIndex) {
            reject(this.name + i);
          } else {
            resolve(this.name + i);
          }
        }, this.time)
      );
    }
  }
}
