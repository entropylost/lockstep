'use strict';

const players = [
    {
        latency: {
            in() {
                return 1000;
            },
            out() {
                return 1000;
            },
        },
        name: 'A',
    },
    {
        latency: {
            in() {
                return 1000;
            },
            out() {
                return 1000;
            },
        },
        name: 'B',
    },
];
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
const root = mod('root', (css, use, $) => {
    css(require('./styles.scss'));
    use(require('./renderer'));
    return {
        view() {
            return $._.renderingContainer(
                ...clients.map((client) =>
                    $.render({
                        state: client.state(),
                    })
                )
            );
        },
    };
});
m.mount(document.body, root.component);
(function render() {
    m.redraw();
    requestAnimationFrame(render);
})();
