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
    const states = [initialState];
    const inputs = [arr(players.length, () => defaultInput)];
    // In a real application, there would have to be fancy syncing done to make sure
    // that all the clients have the same times.
    const start = performance.now();
    const handle = network.handle(id);
    let tick = 0;

    return {
        state() {
            return states[tick];
        },
        start() {
            setInterval(function run() {
                handle.broadcast({
                    tick,
                    input: inputHandler.current(),
                });

                const received = handle.poll();

                received.forEach((arr, otherId) =>
                    arr.forEach((data) => {
                        tick = Math.min(tick, data.tick);
                        inputs[data.tick][otherId] = data;
                    })
                );

                const expectedTick = Math.ceil((performance.now() - start) / SIMULATION_STEP_TIME);
                while (tick < expectedTick) {
                    states[tick + 1] = simulate(states[tick], inputs[tick]);
                    if (inputs[tick + 1] === undefined) {
                        inputs[tick + 1] = arr(players.length, () => defaultInput);
                    }
                    tick++;
                }
            }, SIMULATION_STEP_TIME);
        },
    };
};
