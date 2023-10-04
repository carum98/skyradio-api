import express from 'express'
import { Database } from './database'
import { Server } from './server'

const port = process.env.PORT ?? 3000

const server = new Server()

const database = new Database({
	host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

const router = express.Router()

router.get('/', (async (req, res) => {
	const data = await database.query('SELECT * FROM users')

	res.json(data)
}) as express.RequestHandler)

router.post('/', (async (req, res) => {
    const { name, user_name, password } = req.body

    const data = await database.query('INSERT INTO users (name, user_name, password) VALUES (?, ?, ?)', [name, user_name, password])

    res.json({
        id: data.insertId,
        name,
        user_name,
        password
    })
}) as express.RequestHandler)

server.routes([
	['/users', router]
])

server.listen(port)
