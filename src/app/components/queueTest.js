let arr = [];

for (let i = 0; i < 1000; i++) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i);
    }, Math.random() * 5000);
  });
  promise.then((value) => arr.push(value));
}

async function pull() {}
for (let i = 0; i < 1000; i++) {}
