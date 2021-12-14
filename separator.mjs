import { aggregateFifo } from "aggregate-async-iterator";
import { sequence } from "./util.mjs";

function separator(sequence) {
  let done = false;
  let value;

  let resolveB, bPromise;

  function queueB() {
    bPromise = new Promise(resolve => (resolveB = resolve));
  }
  queueB();

  async function* a() {
    for await (value of sequence) {
      if (value[0] === "A") {
        yield value;
      } else {
        resolveB({ value, done });
        queueB();
      }
    }

    done = true;
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
    aggregateFifo([sequence("A", 80), sequence("B", 40)])
  );

  for await (const ai of aggregateFifo([a, b])) {
    console.log(ai);
  }
}

doit();
