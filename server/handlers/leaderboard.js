
export function setUpLeaderBoard(socket, races, io) {
    
    socket.emit('race-flag:status', {
        trackMode: races.trackMode
    })
 
    socket.on('races:get-state', () => {
        const activeRace = selectActiveSession(races.sessions)
        socket.emit('active-session', activeRace)
    })

}

function selectActiveSession(sessions) {
    return sessions.find(race => race.status === "ongoing" || race.status === "finishing")
}