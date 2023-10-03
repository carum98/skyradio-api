import express from 'express'

const app = express()

const port = process.env.PORT ?? 3000

app.get('/', (req, res) => {
	res.send('Hello World Carlos Eduardo')
})

app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
