// A virtual network.
'use strict';

const { arr } = require('./util');

module.exports = function network(players) {
    const plen = players.length;
    // All messages.
    const messages = arr(plen, () => arr(plen, () => []));
    return {
        // Produces a handle for the player. PlayerId is an index into the players array.
        handle(player) {
            const handle = {
                // Sends `data` to all players, including the current player. The `data` arrives instantly at the current player, but is delayed
                // when sending to other players based on the latency of both (output and input, respectively).
                broadcast(data) {
                    players.forEach((_, i) => handle.send(data, i));
                },
                // Sends `data` to the other player.
                send(data, other) {
                    const latency = other === player ? 0 : players[other].latency.in() + players[player].latency.out();
                    if (latency > 0) {
                        setTimeout(() => messages[other][player].push(data), latency);
                    } else messages[other][player].push(data);
                },
                // Produces an array of all messages sent by all players (including the current player) to this player, and drains the message queue.
                // The messages are not sorted.
                poll() {
                    const messages = messages[player];
                    // Clear messages.
                    messages[player] = arr(plen, () => []);
                    return messages;
                },
            };
            return handle;
        },
    };
};
