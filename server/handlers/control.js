
import { getSessionIdxBySessionId} from "./reception.js"
import { raceEvents } from "../events.js";

export function setUpControl(socket, races, io) {
    //send initial flag
    socket.emit("race-flag:status", { trackMode: races.trackMode }) 
    //send all sessions
    socket.emit("front-desk:state", { sessions: races.sessions }) 

    //listen change of trackmode
    socket.on("race-flag:change",(data, acknowledge)=>{
        
        const {trackMode} = data
        races.trackMode = trackMode    
        
        if (trackMode === "finish") {
            raceEvents.emit("race:finish")
        }
         

        acknowledge({ok:true})
        console.log("new flag:", races.trackMode)
        io.to("public").emit("race-flag:status", {trackMode: races.trackMode})
    })

    //listen change of session status
    socket.on("session-status:change", (data,acknowledge)=>{
        const {sessionId, newStatus} = data
        const sessionInd = getSessionIdxBySessionId(races, sessionId)

        //check if changing is legal: reject finish>>ongoing, end>>finish>>ongoing
        
        races.sessions[sessionInd].status= newStatus
        acknowledge({ok:true})
        io.to("staff").emit("front-desk:state", { sessions: races.sessions })
        io.to("public").emit("front-desk:state", { sessions: races.sessions })

    })

    //send start and end button clicks
    socket.on('start-clicked', ()=>{
        raceEvents.emit("race:start");          
    })

    socket.on('end-clicked', ()=>{
        raceEvents.emit("race:end");          
    })      
}

//listen to countdown expired
export function initializeRaceControl(races, io) {

    raceEvents.on("countdown:expired", () => {
        console.log("Countdown expired")
        finishRace(races, io);
    });
}

// finish logic
export function finishRace(races, io) {
    const activeRace = races.sessions.find(race => race.status === "ongoing")

    if (!activeRace) return

    activeRace.status = "finishing"
    races.trackMode = "finish"

    raceEvents.emit("race:finish")

    io.to("public").emit("race-flag:status", {trackMode: races.trackMode})
    io.to("public").emit("front-desk:state", {sessions: races.sessions})
}