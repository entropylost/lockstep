// All constants.
'use strict';

const SIMULATION_STEP_TIME = 16; // In Milliseconds.
const PLAYER_ACCELERATION = 0.00005;
// A general guideline for how large numbers should be.
const SCALE = 100;
// The viewport of the renderer.
const RENDER_VIEWPORT = {
    x: -50,
    y: -50,
    width: 100,
    height: 100,
};
const RENDER_SCALE = 5;

module.exports = { SIMULATION_STEP_TIME, PLAYER_ACCELERATION, SCALE, RENDER_VIEWPORT, RENDER_SCALE };
