import express from "express"
import cors from "cors"
import "./config"
import {getHistory} from "./ping"

const app = express()

app.use(cors())

app.get("/history", async (req, res) => {
  const history = await getHistory()
  res.send(history)
})

app.listen(process.env.PORT, () => console.log(`port: ${process.env.PORT}`))
