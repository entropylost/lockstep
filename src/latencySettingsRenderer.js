'use strict';

const { mod } = require('./settings');

function rand(center, dist) {
    return Math.random() * 2 * dist + center - dist;
}
const { RENDER_VIEWPORT, RENDER_SCALE } = require('./constants');
const width = RENDER_VIEWPORT.width * RENDER_SCALE;
const scale = width / 1000;
module.exports = function latencySettings(ty) {
    const center = rand(500, 250);
    const dist = Math.random() * 250 + 40;
    const latency = () => rand(center, dist);
    console.log(`Creating settings: ${center}, ${dist}`);
    const component = mod(`latency${ty}`, (css, use, $) => {
        css(require('./latency.scss'));
        return {
            view() {
                return $._.box(
                    {
                        style: {
                            __width: width,
                        },
                    },
                    $._.centerMark({
                        style: {
                            __pos: center * scale,
                        },
                    }),
                    $._.left({
                        style: {
                            __pos: (center - dist) * scale,
                        },
                    }),
                    $._.right({
                        style: {
                            __pos: (center + dist) * scale,
                        },
                    })
                );
            },
        };
    });
    return {
        component,
        latency,
    };
};
