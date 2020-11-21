// All constants.
'use strict';

const SIMULATION_STEP_TIME = 16; // In Milliseconds.
const PLAYER_ACCELERATION = 0.00005;
// A general guideline for how large numbers should be.
const SCALE = 100;
// The viewport of the renderer.
const RENDER_VIEWPORT = {
    x: -200,
    y: -200,
    width: 400,
    height: 400,
};
const RENDER_SCALE = 1.5;

module.exports = { SIMULATION_STEP_TIME, PLAYER_ACCELERATION, SCALE, RENDER_VIEWPORT, RENDER_SCALE };
