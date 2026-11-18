export function setUpNextRace(socket, races, io) {
    //intial state
    socket.on('nextrace:get-state', () => {
        const upcomingRace = selectUpcomingSession(races.sessions);
        socket.emit('upcoming-race', upcomingRace);
    });

}

function selectUpcomingSession(sessions) {
    return sessions.find( race => race.status === "upcoming")
}
