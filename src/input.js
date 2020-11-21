'use strict';

const keyPresses = new Set();

document.addEventListener('keydown', (e) => keyPresses.add(e.key));
document.addEventListener('keyup', (e) => keyPresses.delete(e.key));

module.exports = function inputHandler(keyBindings) {
    return {
        current() {
            const result = {};
            Object.entries(keyBindings).forEach(([binding, key]) => (result[binding] = keyPresses.has(key)));
            return result;
        },
    };
};
