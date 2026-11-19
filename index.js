import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { Server } from "socket.io"
import { loadConfig } from "./server/config.js"
import { setUpAuth } from "./server/auth.js"
import { races } from "./server/state.js"
import { setUpFrontDesk } from "./server/handlers/reception.js"
import { setUpControl } from "./server/handlers/control.js"
import { setUpLapline } from "./server/handlers/tracker.js"
import { setUpCountDown, initializeCountDown } from "./server/handlers/countdown.js"
import { setUpLeaderBoard } from "./server/handlers/leaderboard.js"
import { setUpNextRace } from "./server/handlers/nextrace.js"
import { initializeRaceControl } from "./server/handlers/control.js"

const config = loadConfig()

if (config) {
    const routes = {
        "/": ["./public/index.html", "text/html"],
        "/front-desk": ["./public/reception.html", "text/html"],
        "/race-control": ["./public/control.html", "text/html"],
        "/lap-line-tracker": ["./public/tracker.html", "text/html"],
        "/leader-board": ["./public/leaderboard.html", "text/html"],
        "/next-race": ["./public/nextrace.html", "text/html"],
        "/race-countdown": ["./public/countdown.html", "text/html"],
        "/race-flags": ["./public/flag.html", "text/html"],
        "/css/flag.css": ["./public/css/flag.css", "text/css"],
        "/css/control.css": ["./public/css/control.css", "text/css"],
        "/css/tracker.css": ["./public/css/tracker.css", "text/css"],
        "/css/countdown.css": ["./public/css/countdown.css", "text/css"],
        "/css/leaderboard.css": ["./public/css/leaderboard.css", "text/css"],
        "/css/nextrace.css": ["./public/css/nextrace.css", "text/css"],
        "/css/reception.css": ["./public/css/reception.css", "text/css"],
        "/js/reception.js": ["./public/js/reception.js", "text/javascript"],
        "/js/control.js": ["./public/js/control.js", "text/javascript"],
    }

    const server = createServer(async (req, res) => {
        const pathname = new URL(req.url, "http://localhost").pathname
        const route = routes[pathname]
        if (!route) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
            res.end("Page not found")
            return
        }

        try {
            const [filePath, contentType] = route
            const content = await readFile(new URL(filePath, import.meta.url))
            res.writeHead(200, { "Content-Type": contentType + "; charset=utf-8" })
            res.end(content)
        } catch (error) {
            console.error(error)
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
            res.end("Cannot load client page")
        }
    })

    const io = new Server(server)
    setUpAuth(io, config)
    initializeCountDown(io, config.raceDurationMs);   
    initializeRaceControl(races, io)   

    io.on("connection", (socket) => {
        console.log("client connected")
        socket.emit("server:welcome", "welcome to Racetracker")
        if (socket.data.role === "receptionist") {
            socket.join("staff")
            socket.join("public")
            setUpFrontDesk(socket, races, io)
        }
        if (socket.data.role === "safety") {
            socket.join("staff")
            socket.join("public")
            setUpControl(socket, races, io)
        }
        if(socket.data.role === "observer") {
            socket.join("staff")
            socket.join("public")
            setUpLapline(socket, races, io)
        }        
        if(socket.data.role === "public") {
            socket.join("public")
            setUpCountDown(socket, races, io)
            setUpLeaderBoard(socket, races, io)
            setUpNextRace(socket, races, io)
        }
        //save state
        socket        
    })

    server.listen(config.port, () => {
        console.log("Server running at http://localhost:" + config.port)
    })
}


//bugs to fix
/*
    1) Message in Next Race page should correspond to session status (fixed)
    4) Each car is considered to start its first lap (lap 1) as it passes the lap line for the first time.(fixed)
    5) When race is finished, the cars button should still be visible (fixed)
    6) The server can be started in developer mode with npm run dev, and the countdown timer then lasts 1 minute instead of 10. (fixed)


    UI fix

    1) The Lap-line Tracker is designed for a tablet, and works in both landscape and portrait. (fixed)
    2) The lap button for each car has a large tappable area. (fixed)    

    Xinyu

    1) The Race Control interface is designed for a mobile phone.
    2) When race is ended, the flag should change to danger (Red), now it is checered
*/ 