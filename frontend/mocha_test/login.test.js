const assert = require('assert')
const io = require('socket.io-client')
const server_url = 'http://localhost:3001'
const client = io.connect(server_url, { path: '/mysocket' })
let userInfo
const randomN = Math.floor(Math.random() * 100000)
const TempName = `Test_Name-${randomN}`
console.log('tempName is ' + TempName)
describe('Register a new user', () => {
	it('A new user is registered and it will return a successful registration info', (done) => {
		client.emit('chat_reg', TempName)
		client.on('chat_reg', (res) => {
			userInfo = res
			if (res.code == 200) {
				assert(res.msg === 'success')
				assert(typeof res.data._id === 'string')
				assert(typeof new Date(res.data.createTime).getTime() === 'number')
			}
			done()
		})
	})
})
describe('User Login', () => {
	it('The user has logged in and it will return login info to other users', (done) => {
		client.emit('login', userInfo.data._id)
		client.on('login', (res) => {
			console.log(res)
		})
		done()
	})
})
