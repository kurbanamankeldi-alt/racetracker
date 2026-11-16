export function setUpLeaderBoard(socket, races, io) {

    socket.on('current:state', (state)=>{
        socket.emit('active-session', state)
    })    
    
}