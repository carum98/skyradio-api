import { Request, Response } from 'express'
import { Database } from '@/database'

export class UserController {
    private readonly db: Database

    constructor (db: Database) {
        this.db = db
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const data = await this.db.query('SELECT * FROM users')

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const { name, user_name, password } = req.body

        const data = await this.db.query('INSERT INTO users (name, user_name, password) VALUES (?, ?, ?)', [name, user_name, password])

        res.json({
            id: data.insertId,
            name,
            user_name,
            password
        })
    }
}
