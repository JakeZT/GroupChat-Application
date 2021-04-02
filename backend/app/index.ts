import * as express from 'express'
import * as chalk from 'chalk'
import { http, app } from './socket'

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: false, parameterLimit: 10000 }))
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	res.header('Access-Control-Allow-Credentials')
	res.header('X-Powered-By', ' 3.2.1')
	res.header('Content-Type', 'application/json;charset=utf-8')
	next()
})

app.get('/', (req, res) => {
	res.send('Socket is running at port 3001')
})

app.set('port', 3001)
http.listen(app.get('port'), () => {
	console.log(chalk.bgGreen(chalk.black(' DONE ')) + chalk.green(` Compiled successfully at `) + chalk.blue(`${new Date().toLocaleString()}`))
})
