import { aggregateFifo } from "aggregate-async-iterator";

async function worker() {
  const model = initializeModel();

  for await (const m of model.master) {
    console.log(m);
  }

  for await (const d of model.details) {
    console.log(d);
  }
}

worker();

function initializeModel() {
  const details = [];

  async function* master() {
    for await (const m of sequence("M")) {
      details.push(sequence(`${m}D`));
      yield m;
    }
  }

  return { master: master(), details: aggregateFifo(details) };
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
