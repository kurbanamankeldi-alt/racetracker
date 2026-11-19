export function setUpNextRace(socket, races, io) {
    //intial state
    socket.on('nextrace:get-state', () => {
        socket.emit('upcoming-race', races.sessions)
    });

}