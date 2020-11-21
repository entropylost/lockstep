// A basic simulation with a single simulate function as the export.
'use strict';

const { SIMULATION_STEP_TIME, PLAYER_ACCELERATION } = require('./constants.js');

function mulVec(a, s) {
    return {
        x: a.x * s,
        y: a.y * s,
    };
}
function addVec(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

function computeAcceleration(input) {
    function pos(bool) {
        return bool ? 1 : 0;
    }
    function neg(bool) {
        return bool ? -1 : 0;
    }

    return mulVec(
        {
            x: pos(input.down) + neg(input.up),
            y: pos(input.right) + neg(input.left),
        },
        PLAYER_ACCELERATION
    );
}

module.exports = function simulate(lastState, inputs) {
    const newState = {
        // No use so far of the `players` field, but it will be left just in case.
        players: lastState.players,
        unitState: lastState.unitState.map((state, i) => {
            const input = inputs[i] === null ? state.input : inputs[i];
            return {
                position: addVec(state.position, mulVec(state.velocity, SIMULATION_STEP_TIME)),
                velocity: addVec(state.velocity, mulVec(computeAcceleration(input), SIMULATION_STEP_TIME)),
                input,
            };
        }),
    };
    return newState;
};
