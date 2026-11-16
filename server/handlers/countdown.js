let countdownInterval;

let countdown = {
    min: 9,
    sec: 60
};

export function setUpCountDown(socket, races, io) {

    // Send current countdown to newly connected clients
    socket.on('countdown:get-state', () => {
        socket.emit('countdown:update', countdown);
    });

    // Start countdown
    socket.on('countdown:start', () => {
        if (countdownInterval) return;

        countdownInterval = setInterval(() => {

            if (countdown.min === 0 && countdown.sec === 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                io.emit('countdown:ended');
                return;
            }

            if (countdown.sec === 0) {
                countdown.min--;
                countdown.sec = 59;
            } else {
                countdown.sec--;
            }

            io.emit('countdown:update', countdown);

        }, 1000);
    });

    // Stop countdown
    socket.on('countdown:stop', () => {
        clearInterval(countdownInterval);
        countdownInterval = null;
    });
}

export function selectActiveSession(races) {
    return races.find((race) => race.status === "ongoing");
}    