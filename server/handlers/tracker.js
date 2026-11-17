import { getCountdownState } from "./countdown.js";

export function setUpLapline(socket, races, io) {

    // Initial state request
    socket.on('races:get-state', () => {
        const activeRace = selectActiveSession(races.sessions);
        socket.emit('race-ongoing', activeRace);
    });

    // Receive lap-time request
    socket.on('laptime:add', (data) => {
        const { sessionId, carNumber } = data;

        const sessionInd = races.sessions.findIndex(
            race => race.id === sessionId
        );

        if (sessionInd === -1) {
            console.log("session not found")
            return;
        }

        const activeRace = races.sessions[sessionInd];

        if (activeRace.status !== "ongoing") {
            console.log("found session is not active")
            return;
        }

        // Find car
        const carObj = activeRace.entries.find(
            entry => entry.carNumber === carNumber
        );

        if (!carObj) {
            console.log("no car obj found")
            return;
        }

        // Get countdown state
        const currentTime = getCountdownState();

        //add properties to carobj to calculate the lap time
        carObj.times = [{ min: 10, sec: 0 }];
        carObj.times.push(currentTime);
        carObj.laptime = [];

        for (let i = 1; i < carObj.times.length; i++) {
            carObj.laptime.push(getLapTime(carObj.times[i - 1],carObj.times[i]));
        }

        //laptime added broadcast
        io.to('public').emit('laptime-added', activeRace);

        console.log(`Lap recorded: Car ${carNumber}, Session ${activeRace.id}`);

    });

    // Initial flag state
    socket.emit('race-flag:status', {
        trackMode: races.trackMode
    });

}

export function selectActiveSession(races) {
    return races.find(race => race.status === "ongoing") 
}

function toSeconds(time) {
    return time.min * 60 + time.sec;
}

function getLapTime(previous, current) {
    const difference = toSeconds(previous) - toSeconds(current);

    return {
        min: Math.floor(difference / 60),
        sec: difference % 60
    };
}
