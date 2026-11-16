export function setUpLapline(socket, races, io) {
    
    socket.on('current:state', (state)=>{
        const activeRace = selectActiveSession(state.sessions)
        socket.emit('race-ongoing', activeRace)
    })

    socket.on('laptime-added', (activeRace)=> {
        socket.to('public').emit('laptime-added', activeRace)
    })
       
}

export function selectActiveSession(races) {
    return races.find((race) => race.status === "ongoing");
}