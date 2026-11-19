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

        if (activeRace.status !== "ongoing" && activeRace.status !== "finishing") {
            console.log("Race is ended or not active");
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

        if (!carObj.times) carObj.times = [];
        if (!carObj.laptime) carObj.laptime = [];

        //crossing
        carObj.times.push(currentTime);
     
        //current lap
        carObj.laps = carObj.times.length;

        //calculation after the first time crossing
        if (carObj.times.length > 1) {
            const previousTime = carObj.times[carObj.times.length - 2];
            const lapTime = getLapTime(previousTime,currentTime);
            carObj.laptime.push(lapTime);

            const lapSeconds = toSeconds(lapTime);

            if (!carObj.fastestLap || lapSeconds < toSeconds(carObj.fastestLap)) {
                carObj.fastestLap = lapTime;
            }            
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
    return races.find(race => race.status === "ongoing" || race.status === "finishing") 
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
