/**
 * Returns a promise which resolves after time had passed.
 */
const delay = time => new Promise(resolve => setTimeout(resolve, time));

async function* delayedRange(max) {
  for (let i = 0; i < max; i++) {
    await delay(1000);
    yield i;
  }
}

console.log('example start');

async function worker() {
  for await (let number of delayedRange(10)) {
    //console.log(number);
    alert(number);
  }
}

worker();
