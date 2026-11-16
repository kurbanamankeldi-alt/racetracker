let currentRaces = null

export function setUpLapline(socket, races, io) {
    
    socket.on('current:state', (races)=>{
        currentRaces = races.sessions
        io.to('lap-line-tracker').emit('race:state-ready')        
    })

    socket.on('races:get-state', ()=> {
        if (currentRaces === null) {
            socket.emit('race:state-pending')
            return
        }        
        const activeRace = selectActiveSession(currentRaces)
        socket.emit('race-ongoing', activeRace)
    })

    socket.on('laptime-added', (activeRace)=> {
        socket.to('public').emit('laptime-added', activeRace)
    })    
    
}

export function selectActiveSession(races) {
    return races.find((race) => race.status === "ongoing");
}