export function setUpCountDown(socket, races, io) {
    socket.on('trackMode', (trackMode, state)=> {
        socket.emit('race-status', trackMode, state)
    })
    socket.on('countdown-started', (countdown)=>{
        socket.to('public').emit('countdown-started', countdown)
    })
}