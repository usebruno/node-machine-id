const { machineId, machineIdSync } = require(".");

const mid = machineIdSync();
console.log("machine sync id", mid);

machineId().then((mid) => {
  console.log("machine id", mid);
});
