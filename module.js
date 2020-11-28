async function worker() {
  const init = initializeModel();

  for await (const s of init.a) {
    console.log(s);
  }
}

worker();


function initializeModel()
{
  const a = sequence("a");
  const b = sequence("b");

  return {
    a,
    b
  };
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
