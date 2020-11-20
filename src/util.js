'use strict';

module.exports = {
    arr(len, fn) {
        return Array(len)
            .fill(null)
            .map(() => fn());
    },
};
