'use strict';

const { SIMULATION_STEP_TIME } = require('./constants');
const simulate = require('./simulation');

const { arr } = require('./util');
const defaultInput = {
    up: false,
    left: false,
    down: false,
    right: false,
};
module.exports = function client({ inputHandler, network, players, id, initialState }) {
    let state = initialState;
    const inputs = [];
    const start = performance.now();
    const handle = network.handle(id);
    const tickLag = 120;
    let tick = 0;
    let lastInput = defaultInput;
    let toStop = false;
    return {
        state() {
            return state;
        },
        start() {
            (function run() {
                const currentInput = inputHandler.current();
                if (Object.entries(currentInput).some(([k, v]) => v !== lastInput[k])) {
                    handle.broadcast({
                        tick: tick + tickLag,
                        input: currentInput,
                    });
                }
                lastInput = currentInput;

                const received = handle.poll();

                received.forEach((receivedInputs, otherId) =>
                    receivedInputs.forEach((data) => {
                        console.log('Received: ');
                        console.log(data);
                        if (data.tick < tick) {
                            throw new Error('Too late.');
                        }
                        if (inputs[data.tick] === undefined) {
                            inputs[data.tick] = arr(players.length, () => null);
                        }
                        inputs[data.tick][otherId] = data.input;
                    })
                );

                const expectedTick = Math.ceil((performance.now() - start) / SIMULATION_STEP_TIME);
                while (tick < expectedTick) {
                    if (inputs[tick] === undefined) {
                        inputs[tick] = arr(players.length, () => null);
                    }
                    // console.log(inputs);
                    state = simulate(state, inputs[tick]);
                    tick++;
                }
                if (!toStop) {
                    requestAnimationFrame(run);
                }
            })();
        },
        stop() {
            toStop = true;
        },
    };
};
module.exports.defaultInput = defaultInput;
