import { raceEvents } from "../events.js";

let countdownInterval;

let countdown = {
    min: 10,
    sec: 0,
    status: "ready"
};

export function getCountdownState() {
    return { ...countdown };
}

export function initializeCountDown(io) {

    raceEvents.on("race:start", () => {
        console.log("Countdown: race started");
        stopCountDown();

        countdown = {
            min: 10,
            sec: 0,
            status: "running"
        };

        io.emit("countdown:update", countdown);
        startCountDown(io);
    });

    raceEvents.on("race:finish", () => {
        console.log("Countdown: race finished");
        stopCountDown();
        countdown.status = "finished";
        io.emit("countdown:update", countdown);        
    });    

    raceEvents.on("race:end", () => {
        console.log("Countdown: race ended");
        stopCountDown();
        countdown.status = "ended";
        io.emit("countdown:update", countdown);        
    });
    
}

export function setUpCountDown(socket, races, io) {
    socket.on('countdown:get-state', () => {
        socket.emit('countdown:update', getCountdownState());
    });
}

function startCountDown(io) {
        if (countdownInterval) return;

        countdownInterval = setInterval(() => {

            if (countdown.min === 0 && countdown.sec === 0) {
                stopCountDown();
                countdown.status = "finished";
                io.emit("countdown:update", countdown);
                io.emit("countdown:ended");  
                //notify server
                raceEvents.emit("countdown:expired");              
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