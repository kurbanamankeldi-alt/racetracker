// Shared by all connections in this server process.
import { readFile, writeFile } from "node:fs/promises"


// export const races = {
//   "sessions": [],
//   "nextSessionId": 1,
//   "trackMode": "danger" //safe hazard dander finish
// }


const data = await readFile(new URL("./save.json", import.meta.url), "utf8")

export const races = JSON.parse(data)

export const saveState = async()=>{
  await writeFile(
    new URL("./save.json", import.meta.url),
    JSON.stringify(races, null, 2),
    "utf8"
)
}