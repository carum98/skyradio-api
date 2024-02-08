import { dateNowFormatted } from '@/utils'
import fs from 'fs'
import path from 'path'

export function errorLog (err: Error): void {
    const { date, time } = dateNowFormatted()

    const logPath = path.join(__dirname, `../../logs/${date}.txt`)
    const log = `${time} - ${err}\n ---------------- \n`
    fs.appendFileSync(logPath, log)
}
