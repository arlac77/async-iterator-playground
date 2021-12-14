export async function* sequence(name, time = 100, num = 8, errIndex = -1) {
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

export async function wait(msecs = 1000) {
  return new Promise((resolve, rejact) => setTimeout(resolve, msecs));
}
