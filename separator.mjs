import { aggregateFifo } from "aggregate-async-iterator";
import { sequence } from "./util.mjs";

function separator(sequence, decide) {
  let resolveB, bPromise;

  function queueB(value, done) {
    if (value !== undefined) {
      resolveB({ value, done });
    }

    if (!done) {
      bPromise = new Promise(resolve => {
        resolveB = resolve;
      });
    }
  }

  queueB();

  async function* a() {
    for await (const value of sequence) {
      if(decide(value)) {
        yield value;
      } else {
        queueB(value, false);
      }
    }
  }

  return [
    a(),
    {
      next: () => bPromise
    }
  ];
}

async function doit() {
  const [a, b] = separator(
    aggregateFifo([sequence("A", 80), sequence("B", 40)]),
    (item) => item[0] === "A"
  );

  for await (const ai of aggregateFifo([a, b])) {
    console.log(ai);
  }
}

doit();
