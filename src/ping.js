import * as fcl from "@onflow/fcl"
import {INIT, spawn, send} from "@onflow/util-actor"

const NAME = "PING"
const DELAY = 60_000
const HISTORY_LENGTH = 30
const TICK = "TICK"
const GET_HISTORY = "GET_HISTORY"

async function ping() {
  try {
    return await fcl
      .send([fcl.script`pub fun main(): Bool { return true }`])
      .then(fcl.decode)
  } catch (error) {
    return false
  }
}

const HANDLERS = {
  [INIT]: async ctx => {
    ctx.put("history", [])
    ctx.sendSelf(TICK)
  },
  [TICK]: async ctx => {
    var t1 = Date.now()
    var success = await ping()
    var t2 = Date.now()
    var next = {success, delta: t2 - t1, at: t1}
    ctx.update("history", history =>
      [next, ...history].slice(0, HISTORY_LENGTH)
    )
    setTimeout(() => ctx.sendSelf(TICK), DELAY)
  },
  [GET_HISTORY]: async (ctx, letter) => {
    letter.reply(ctx.get("history"))
  },
}

spawn(HANDLERS, NAME)

export const getHistory = () => {
  return send(NAME, GET_HISTORY, null, {expectReply: true, timeout: 0})
}
