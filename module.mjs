import { aggregateFifo } from "aggregate-async-iterator";

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

  await processMaster(model);
  processDetails(model);
}

worker();

function initializeModel() {

  const masters = new Set();

  const details = [empty()];

  async function* master() {
    for(const m of masters) { yield m; }

    for await (const m of sequence("M")) {
      masters.add(m);
      details.push(sequence(`${m}D`));
      yield m;
    }
  }

  return {
    masters,
    master: master(),
    details: aggregateFifo(details) };
}

async function* empty() {
}

async function* sequence(name, time = 100, num = 10, errIndex = -1) {
  for (let i = 0; i < num; i += 1) {
    yield new Promise((resolve, reject) =>
      setTimeout(() => {
        if (i === errIndex) {
          reject(name + i);
        } else {
          resolve(name + i);
        }
      }, time)
    );
  }
}
