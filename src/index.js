'use strict';
const latencySettings = require('./latencySettingsRenderer');
const players = ['A', 'B'].map((name) => {
    const inLatency = latencySettings('in');
    const outLatency = latencySettings('out');
    return {
        name,
        latency: {
            in: inLatency.latency,
            out: outLatency.latency,
        },
        latencyRender: {
            in: inLatency.component,
            out: outLatency.component,
        },
    };
});
const network = require('./vnet')(players);
const wasd = {
    up: 'w',
    left: 'a',
    down: 's',
    right: 'd',
};
const ijkl = {
    up: 'i',
    left: 'j',
    down: 'k',
    right: 'l',
};
function vec(x, y) {
    return {
        x,
        y,
    };
}
const client = require('./client');
const input = require('./input');
const initialState = {
    players,
    unitState: [vec(-20, 0), vec(20, 0)].map((position) => ({
        position,
        velocity: vec(0, 0),
        input: client.defaultInput,
    })),
};
const clients = [wasd, ijkl].map((keys, id) =>
    client({
        inputHandler: input(keys),
        network,
        players,
        id,
        initialState,
    })
);

clients.forEach((client) => client.start());

const { mod, m } = require('./settings.js');
const playerRender = mod('player', (css, use, $, initial) => {
    css(require('./styles.scss'));
    use(require('./renderer'));
    const i = initial.attrs.id;
    use(players[i].latencyRender.in);
    use(players[i].latencyRender.out);
    return {
        view() {
            return $._.playerRender(
                $.latencyin(),
                $.latencyout(),
                $.render({
                    state: clients[i].state(),
                })
            );
        },
    };
});
const root = mod('root', (css, use, $) => {
    css(require('./styles.scss'));
    use(require('./renderer'));
    use(playerRender);
    return {
        view() {
            return $._.renderingContainer(...clients.map((_, id) => $.player({ id })));
        },
    };
});
m.mount(document.body, root.component);
console.log(players);
(function render() {
    m.redraw();
    requestAnimationFrame(render);
})();
