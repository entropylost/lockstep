'use strict';

const { mod } = require('./settings');

function rand(center, dist) {
    return Math.random() * 2 * dist + center - dist;
}
const { RENDER_VIEWPORT, RENDER_SCALE, LATENCY_MAX } = require('./constants');
const width = RENDER_VIEWPORT.width * RENDER_SCALE;
const scale = width / LATENCY_MAX;
module.exports = function latencySettings(ty) {
    let center = rand(500, 250);
    let dist = Math.random() * 250;
    const latency = () => rand(center, dist);
    let dragged = null;
    let lastMousePosition = null;
    document.addEventListener('mousemove', (e) => {
        if (lastMousePosition != null) {
            const delta = (e.clientX - lastMousePosition) / scale;
            if (dragged == 'left') {
                dist -= delta;
            } else if (dragged == 'center') {
                center += delta;
            } else if (dragged == 'right') {
                dist += delta;
            }
            dist = Math.max(dist, 0);
            center = Math.min(Math.max(center, dist + 60), LATENCY_MAX - dist - 60);
        }
        lastMousePosition = e.clientX;
    });
    document.addEventListener('mouseup', () => (dragged = null));
    const component = mod(`latency${ty}`, (css, use, $) => {
        css(require('./latency.scss'));
        return {
            view() {
                return $._.container(
                    $._.box(
                        {
                            style: {
                                __width: width,
                            },
                        },
                        $._.text(`${ty}put lag controls`),
                        $._.centerMark({
                            style: {
                                __pos: center * scale,
                            },
                            onmousedown() {
                                dragged = 'center';
                                return false;
                            },
                        }),
                        $._.left({
                            style: {
                                __pos: (center - dist - 40) * scale,
                            },
                            onmousedown() {
                                dragged = 'left';
                                return false;
                            },
                        }),
                        $._.right({
                            style: {
                                __pos: (center + dist + 40) * scale,
                            },
                            onmousedown() {
                                dragged = 'right';
                                return false;
                            },
                        }),
                    )
                );
            },
        };
    });
    return {
        component,
        latency,
    };
};
