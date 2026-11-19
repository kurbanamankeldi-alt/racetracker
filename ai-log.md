# AI Log — Racetrack

| Topic | How AI was used | What was learned |
|---|---|---|
| Socket.IO acknowledgements | Xinyu asked how a browser receives a response to an event it sends. | The browser passes a callback with the request. Socket.IO calls it when the server acknowledges that request. This is separate from broadcasting updated state to other clients. |
| Duplicate session creation | Xinyu asked AI to inspect why one click on Create Session created multiple sessions. | The click listener was registered inside the state update handler. Every new snapshot added another listener to the same button. |
| Race Control login | Xinyu asked AI to inspect why the password form stayed visible after a successful connection. | The form had both the `hidden` and `password` classes. Both CSS rules set `display`, and the later rule won because they had equal specificity. |
| Countdown expiry | Xinyu asked AI to trace what happens when the countdown reaches zero. | The original automatic finish path updated the countdown and flag, while the session itself remained `ongoing`. Xinyu learned to trace these state changes separately. |
| Persistence | Xinyu asked AI to review which server events change the saved state. | Lap times were stored in memory before saving was connected. The countdown also lived outside the saved state, so restoring a session alone could not restore its remaining time. |
| Environment variables | Xinyu asked how PowerShell variables and `.env` reach Node.js. | Node.js reads them through `process.env`. Xinyu can log variable names without revealing keys. |
| HTTP routes and static files | Xinyu asked why the Race Control HTML loaded while its JavaScript returned 404. | A script tag asks the browser to fetch a URL. His server’s explicit route table needs to serve that URL. |
| Switch behaviour | Xinyu asked why each case needed `break`. | Without it, later cases may run and overwrite the colour chosen by the matching case. |
| HTTP and Socket.IO | Xinyu asked why opening a page did not trigger the Socket.IO connection handler. | Fetching HTML and connecting a Socket.IO client are separate steps. |
| Connection authentication | Xinyu asked where the browser sends the key and where the server reads it. | The browser supplies custom fields in `auth`, and the server reads them from `socket.handshake.auth`. |
| Server-assigned roles | Xinyu asked what `socket.data.role` means. | The server stores the verified role on the connection and uses it to authorize actions. |
| Connection errors | Xinyu asked why a custom error code could be undefined. | Connection failures may omit `data.code`. Optional chaining handles that case. |
| Socket.IO rooms | Xinyu asked why the flag display received the welcome event but missed flag updates. | The welcome went directly to the socket. A typo kept the display out of the room that received updates. |
| Missing acknowledgement callback | Xinyu asked why Race Control reported that `acknowledge` was not a function. | That client sent the payload without a callback. Comparing the client and server signatures exposed the mismatch. |
| Validation and early returns | Xinyu asked whether to return after acknowledging an invalid request. | Acknowledging an error does not stop the handler. An early return prevents later state changes or a second reply. |
| Request fields and types | Xinyu asked why adding a driver could not find the session and why trimming a name could throw. | Field names are case sensitive. Xinyu needs to verify that a name is a string before calling `.trim()`. |
| Stable session IDs | Xinyu asked why deriving an ID from the last session could cause a problem. | Deleting the last session can cause ID reuse, so a stale request may target a different race. |
| Rendering objects | Xinyu asked why the session list displayed `[object Object]`. | Assigning objects to `textContent` converts them to strings. JSON formatting exposes their contents during debugging. |
| Template selectors | Xinyu asked why the session list stayed blank after login. | A missing dot in a class selector returned `null`. Attaching a listener to that result interrupted rendering. |
| Stale Race Control listeners | Xinyu asked why Start could affect a previous race. | Old listeners retained the session they captured when registered and still ran after a new snapshot arrived. |
| Checkbox state | Xinyu asked how to read a checkbox and why End stayed disabled. | `.checked` is a boolean. A script error from using a `const` before initialization can prevent listeners from being registered. |
| Empty session display | Xinyu asked why the final session card stayed visible after End Session. | The empty branch returned before clearing the old card. |
| Save and load paths | Xinyu asked AI to review the persistence flow. | The first implementation wrote to a different file from the one it loaded at startup. |
| Countdown recovery | Xinyu asked how to resume the countdown after a restart. | A saved end timestamp lets the server calculate the remaining time, including time spent offline. |
| Race Countdown | Aman used AI to generate simple and repeatable CSS for the countdown display. | Not recorded |
| Leaderboard | Aman used AI to generate simple and repeatable CSS for the leaderboard display. | Not recorded |


## AI Addition

I will record the addition separately as it progresses, including the user need, what I delegated, what I tested, where AI output needed revision, and what I could verify independently.

| UI addition | Xinyu chose the UI improvements and approved AI implementation of the optional presentation layer and startup toggle. | The extension can change how the same race data is presented while the base pages remain available. |

### Files containing extension code

| File | AI extension code |
|---|---|
| `server/config.js` | Parses the `--no-ai` flag. |
| `index.js` | Registers and loads extension assets when enabled. |
| `public/nextrace.html` | Uses the extension to label assigned cars. |
| `public/leaderboard.html` | Uses the extension to format results. |
| `public/ai-extension/ui.js` | Implements the optional UI changes. |
| `public/ai-extension/ui.css` | Styles the optional UI changes. |
