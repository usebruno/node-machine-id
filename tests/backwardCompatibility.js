const chai = require("chai");
const assert = chai.assert;
const { machineId, machineIdSync } = require("../index.js");
const nodeMachineId = require("node-machine-id");

const ogMachineId = nodeMachineId.machineId;
const ogMachineIdSync = nodeMachineId.machineIdSync;

describe("Backward Compatibilty: machineId({original: true})", function () {
  it("node-machine-id and @usebruno/node-machine-id should return the same device ids", async () => {
    let id = await machineId({ original: true });
    let ogId = await ogMachineId({ original: true });
    assert.equal(id, ogId);
  });
});

describe("Backward Compatibilty: machineIdSync({original: true})", function () {
  it("node-machine-id and @usebruno/node-machine-id should return the same device ids", async () => {
    let id = machineIdSync({ original: true });
    let ogId = ogMachineIdSync({ original: true });
    assert.equal(id, ogId);
  });
});
