import express from "express"
import "./config"
import {getHistory} from "./ping"

const app = express()

app.get("/status", async (req, res) => {
  const history = await getHistory()
  res.send(history)
})

app.listen(process.env.PORT, () => console.log(`port: ${process.env.PORT}`))