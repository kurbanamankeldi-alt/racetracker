import { raceEvents } from "../events.js";

let countdownInterval;

let countdown = {
    min: 10,
    sec: 0
};

export function getCountdownState() {
    return { ...countdown };
}

export function initializeCountDown(io) {

    raceEvents.on("race-flag:change", (snapshot) => {
        console.log("Countdown received:", snapshot.trackMode);

        if (snapshot.trackMode === "safe") {
            startCountDown(io);
        }

        if (snapshot.trackMode === "finish") {
            stopCountDown();
        }
    });
}

export function setUpCountDown(socket, races, io) {
    socket.on('countdown:get-state', () => {
        socket.emit('countdown:update', countdown);
    });
}

function startCountDown(io) {
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
}

function stopCountDown() {
    clearInterval(countdownInterval);
    countdownInterval = null;    
}

export function selectActiveSession(races) {
    return races.find((race) => race.status === "ongoing");
}    