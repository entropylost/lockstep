'use strict';

const { mod } = require('./settings');
const { RENDER_VIEWPORT, RENDER_SCALE } = require('./constants');

module.exports = mod('render', (css, use, $) => {
    css(require('./renderer.scss'));
    return {
        view(vnode) {
            const state = vnode.attrs.state;
            return $._.renderBox(
                {
                    style: {
                        __width: RENDER_SCALE * RENDER_VIEWPORT.width,
                        __height: RENDER_SCALE * RENDER_VIEWPORT.height,
                    },
                },
                state.playerUnitState.map(({ position }, i) => {
                    return $._.renderUnit({
                        style: {
                            __x: (position.x - RENDER_VIEWPORT.x) * RENDER_SCALE,
                            __y: (position.y - RENDER_VIEWPORT.y) * RENDER_SCALE,
                            __name: `'${state.players[i].name}'`,
                        },
                    });
                })
            );
        },
    };
});
