'use strict';

const players = [
    {
        latency: {
            in() {
                return Math.random() * 1000;
            },
            out() {
                return Math.random() * 1000;
            },
        },
        name: 'A',
    },
    {
        latency: {
            in() {
                return Math.random() * 1000;
            },
            out() {
                return Math.random() * 1000;
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
const initialState = {
    players,
    playerUnitState: [
        {
            position: vec(-20, 0),
            velocity: vec(0, 0),
        },
        {
            position: vec(20, 0),
            velocity: vec(0, 0),
        },
    ],
};
const clients = [
    require('./client')({
        inputHandler: require('./input')(wasd),
        network,
        players,
        id: 0,
        initialState,
    }),
    require('./client')({
        inputHandler: require('./input')(ijkl),
        network,
        players,
        id: 1,
        initialState,
    }),
];
clients.forEach((client) => client.start());

const { mod, m } = require('./settings.js');
const root = mod('root', (css, use, $) => {
    css(require('./styles.scss'));
    use(require('./renderer'));
    return {
        view() {
            return $._(
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
