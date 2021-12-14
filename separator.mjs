import { aggregateFifo } from "aggregate-async-iterator";
import { sequence, wait } from "./util.mjs";

function separator(sequence) {

    let done = false;

    let x;

  const a = async function* () {
      for await(x of sequence) {
          const n = Number.parseInt(x[1]);
          if(n % 2) {
            yield x;
            x= undefined;
          }
          else {

          }
      }

      done = true;
    },

    b = async function* () {
        while(!done) {
            if(x) {
                yield x;
                x = undefined;
            }
            await wait(100);
        }
    };

  return [a(), b()];
}

async function doit() {
  const [a, b] = separator(sequence("X"));

  for await (const ai of aggregateFifo([a, b])) {
    console.log(ai);
  }
}

doit();
