import { raceEvents } from "../events.js"
import { races, saveState } from "../state.js"

let countdownInterval
let initialMinutes = 10


export function getCountdownState() {
    return { ...races.countdown }
}

export function initializeCountDown(io, configSpec) {

    initialMinutes = configSpec / 60000;

    // Check if a race was ongoing before server restart
    const activeRace = selectActiveSession(races.sessions);

    if (activeRace && races.countdown?.status === "running") {
        startCountDown(io)
        io.emit("countdown:update", races.countdown)
    } else if (activeRace) {
        races.countdown = {
            min: initialMinutes,
            sec: 0,
            status: "running"
        }

        saveState()
        io.emit("countdown:update", races.countdown)
        startCountDown(io)
    } else {
        races.countdown = {
            min: initialMinutes,
            sec: 0,
            status: "ready"
        }
        saveState()
    }

    
    raceEvents.on("race:start", () => {
        console.log("Countdown: race started");
        stopCountDown()
        
        races.countdown = {
            min: initialMinutes,
            sec: 0,
            status: "running"
        }

        saveState()     
        
        io.emit("countdown:update", races.countdown)
        startCountDown(io)
    })

    raceEvents.on("race:finish", () => {
        console.log("Countdown: race finished")
        stopCountDown()
        races.countdown.status = "finished"
        io.emit("countdown:update", races.countdown)  
        saveState()     
    })    

    raceEvents.on("race:end", () => {
        console.log("Countdown: race ended")
        stopCountDown()
        races.countdown.status = "ended"
        io.emit("countdown:update", races.countdown)      
        saveState() 
    })
    
}

export function setUpCountDown(socket, races, io) {
    socket.on('countdown:get-state', () => {
        socket.emit('countdown:update', getCountdownState())
    })
}

function startCountDown(io) {
        if (countdownInterval) return

        countdownInterval = setInterval(() => {

            if (races.countdown.min === 0 && races.countdown.sec === 0) {
                stopCountDown()
                races.countdown.status = "finished";
                io.emit("countdown:update", races.countdown)
                io.emit("countdown:ended")  
                saveState()
                //notify server
                raceEvents.emit("countdown:expired")              
                return
            }

            if (races.countdown.sec === 0) {
                races.countdown.min--
                races.countdown.sec = 59
            } else {
                races.countdown.sec--
            }

            io.emit('countdown:update', races.countdown)
            saveState();

        }, 1000)    
}

function stopCountDown() {
    clearInterval(countdownInterval)
    countdownInterval = null    
}

export function selectActiveSession(races) {
    return races.find((race) => race.status === "ongoing")
}