const chai = require('chai');
const assert = chai.assert;
const { machineId, machineIdSync } = require('../index.js');
const nodeMachineId = require('node-machine-id');

const originalMachineId = nodeMachineId.machineId;
const originalMachineIdSync = nodeMachineId.machineIdSync;

describe('Backward Compatibilty: machineId({original: true})', function () {
  it('node-machine-id and @usebruno/node-machine-id should return the same device ids', async () => {
    let id = await machineId({ original: true });
    let originalId = await originalMachineId({ original: true });
    assert.equal(id, originalId);
  });
});

describe('Backward Compatibilty: machineIdSync({original: true})', function () {
  it('node-machine-id and @usebruno/node-machine-id should return the same device ids', async () => {
    let id = machineIdSync({ original: true });
    let originalId = originalMachineIdSync({ original: true });
    assert.equal(id, originalId);
  });
});
