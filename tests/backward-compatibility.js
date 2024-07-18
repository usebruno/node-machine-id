const chai = require('chai');
const assert = chai.assert;
const { machineId, machineIdSync } = require('../index.js');
const nodeMachineId = require('node-machine-id');

describe('Backward Compatibilty: machineId({original: true})', function () {
  it('node-machine-id and @usebruno/node-machine-id should return the same device ids', async () => {
    let id = await machineId({ original: true });
    assert.equal(id, await nodeMachineId.machineId({ original: true }));
  });
});

describe('Backward Compatibilty: machineIdSync({original: true})', function () {
  it('node-machine-id and @usebruno/node-machine-id should return the same device ids', async () => {
    let id = machineIdSync({ original: true });
    assert.equal(id, nodeMachineId.machineIdSync({ original: true }));
  });
});
