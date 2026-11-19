# Racetracker

Racetracker is a real-time race management system for Beachside Racetrack. Staff use it to prepare race sessions, control track flags, and record lap crossings. Drivers and spectators can follow the queue, countdown, flags, and results from separate displays. A Node.js server uses Socket.IO to keep the interfaces in sync.

## Setup and startup

1. Install Node.js 24 and run `npm install` from the project root.
2. Copy `.env.example` to `.env` and set a different nonblank access key for each staff role:

   | Variable | Interface |
   |---|---|
   | `RECEPTIONIST_KEY` | Front Desk |
   | `SAFETY_KEY` | Race Control |
   | `OBSERVER_KEY` | Lap-line Tracker |

3. Run one of the following commands:

   | Command | Race duration | UI |
   |---|---|---|
   | `npm start` | 10 minutes | AI addition enabled |
   | `npm run dev` | 1 minute | AI addition enabled |
   | `npm start -- --no-ai` | 10 minutes | Base UI |
   | `npm run dev -- --no-ai` | 1 minute | Base UI |

4. Open [Racetracker](http://localhost:3000). For other devices, use the server's reachable address or a deployed URL with the same routes. `localhost` refers to the device opening the browser.

The server requires all three keys at startup. Keep `.env` private. Staff enter their own key on the corresponding page, while public displays open without a key. The server loads the saved race state from `server/save.json` at startup, so keep that file available.

## Interfaces

| Route | Who uses it | What it does |
|---|---|---|
| [`/front-desk`](http://localhost:3000/front-desk) | Receptionist | Create or remove upcoming sessions, add or remove drivers, and edit names. The server assigns car numbers automatically. |
| [`/race-control`](http://localhost:3000/race-control) | Safety Official | Review the current session, start the race, change flags, and confirm cars have returned before ending the session. |
| [`/lap-line-tracker`](http://localhost:3000/lap-line-tracker) | Lap-line Observer | Tap a car's number when it crosses the lap line. |
| [`/leader-board`](http://localhost:3000/leader-board) | Spectators | View driver names, car numbers, current laps, fastest lap times, remaining time, and the current flag. |
| [`/next-race`](http://localhost:3000/next-race) | Drivers | See the upcoming driver list, assigned cars, and paddock instructions. |
| [`/race-countdown`](http://localhost:3000/race-countdown) | Drivers | View the time remaining in the race. |
| [`/race-flags`](http://localhost:3000/race-flags) | Drivers | View the current track flag. |

## User guide

1. In **Front Desk**, create an upcoming session and add up to eight drivers. Check the assigned car numbers. Driver names must be unique within the session.
2. In **Race Control**, review the session and brief the drivers. When it is safe to start, select **Start**. The countdown begins, the flag turns green, the leaderboard switches to the current race, and **Next Race** advances to the following session.
3. During the race, use **Race Control** to change the flag as needed. In **Lap-line Tracker**, tap the car's number at each crossing. The first crossing starts lap 1. Subsequent crossings record completed laps, and the leaderboard ranks cars by fastest completed lap.
4. Select **Finish** or let the countdown expire. The chequered flag tells drivers to return to the pit lane. After confirming that every car has returned, select **End Session**. The session closes and Race Control shows the next session if one is available.

| Flag | Display | Instruction |
|---|---|---|
| Safe | Green | Proceed normally |
| Hazard | Yellow | Drive slowly |
| Danger | Red | Stop |
| Finish | Black and white chequered | Return to the pit lane |

## Extra features

- **Saved race state.** Sessions, driver entries, recorded lap data, and the track mode are saved in `server/save.json` and loaded on restart. An active countdown's remaining time is currently held in memory and is not restored from the file.
- **Pit return checklist.** After Finish, the Safety Official checks each car off in Race Control as it returns to the pit lane. The page makes **End Session** available once all cars are checked.

## AI addition

**Clearer Racetrack Interfaces** is an optional UI addition for staff, drivers, and spectators. The homepage groups entry points for staff and visitors. Next Race labels assigned car numbers so drivers can spot their cars, and the leaderboard separates names, car numbers, laps, and best times for easier reading. Front Desk and Race Control give staff a larger sign-in button and a clearer prompt on phones.

The addition runs by default with `npm start`. To review the base UI, run `npm start -- --no-ai`. See [the AI log](ai-log.md) for the collaboration record.
