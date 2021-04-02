import * as express from 'express'
import * as chalk from 'chalk'
import * as mongoose from '../db'
import { createServer } from 'http'
import { Socket } from 'socket.io'
import { Data, Message, Basic } from '../objectType'
import { createResponse, roomListResponse, alertResponse, roomResponse, createDispatch, RegisterRes, NewUserRes, createAddDispatch } from '../response'
import User from '../db/module/User'
import Room from '../db/module/Room'
import Records from '../db/module/Records'
import { RecordModel } from '../db/module/Records'

const app = express()
const http = createServer(app)
const io = require('socket.io')(http, { path: '/mysocket' })
const ObjectId = mongoose.ObjectId

interface _ChatRoom {
	readonly GroupChat: number
	readonly PrivateChat: number
}
const ChatRoom: _ChatRoom = {
	GroupChat: 0,
	PrivateChat: 1,
}
io.on('connection', (socket: Socket) => {
	socket.on('login', async (userId: string) => {
		await User.updateOne({ _id: ObjectId(userId) }, { $set: { socket_id: socket.id } })
		socket.emit('login', socket.id)
	})

	socket.on('chat_reg', async (username: string) => {
		let user = new User({
			user_name: username,
			current_room_id: '',
			socket_id: socket.id,
		})
		try {
			//register operation
			const res = await user.save()
			socket.emit('chat_reg', RegisterRes(true, res))
			let room_info = new Room({
				user_id: res._id.toString(),
				user_name: username,
				room_name: 'All',
				status: ChatRoom.GroupChat,
				num: 0,
				badge_number: 0,
				current_status: false,
			})
			// save all the chat rooms
			const response = await room_info.save()
			// send room list to users
			socket.emit('get_room_list', NewUserRes(true, { once: true, data: [response] }))
		} catch (err) {
			socket.emit('chat_reg', alertResponse(false, 'Registered Failed'))
		}
	})

	socket.on('get_room_list', async (userId: string) => {
		const data = await Room.find({ user_id: userId })
		socket.emit('get_room_list', roomListResponse(true, { once: true, data }))
	})

	socket.on('join', async (data: Data) => {
		// Create a room
		data.status == ChatRoom.GroupChat ? socket.join(data.roomName) : socket.join(`${data.roomName?.split('-')[0]}-${data.roomName?.split('-')[1]}`)
		// User's current room
		const user_data = await User.findOne({ _id: ObjectId(data.userId) })
		// If the two chat rooms of the user are the same, they will not be updated, otherwise, they will join successfully
		if (user_data?.current_room_id !== data.roomId) {
			// Update the user’s current chat room
			await User.updateOne({ _id: ObjectId(data.userId) }, { $set: { current_room_id: data.roomId } })
			// update status
			try {
				await Room.updateMany({ user_id: data.userId }, { $set: { current_status: false } })
				await Room.updateOne({ _id: ObjectId(data.roomId) }, { $set: { current_status: true } })
				// leave room
				data.leaveRoom ? await leaveRoom(socket, data.leaveRoom) : ''
				// Clear the number of unread messages
				await Room.updateOne({ _id: ObjectId(data.roomId) }, { $set: { badge_number: 0 } })
				// get the chat room messages
				try {
					const records = await Records.find({ room_name: data.roomName })
					socket.emit(
						'chat_message',
						createDispatch(true, {
							action: 'SET',
							data: records,
						})
					)
				} catch (err) {
					if (err) return
				}

				//
				const current_room_list = await Room.find({ room_name: data.roomName, current_status: true })
				// Get the number of people currently online in the chat room
				await Room.updateMany(
					{ room_name: data.roomName },
					{
						$set: { num: current_room_list.length },
					}
				)
				await updateRoomList()
				// Send a message to all users
				io.sockets.in(data.roomName).emit(
					'chat_message',
					createAddDispatch(true, {
						action: 'ADD',
						data: {
							user_id: data.userId,
							user_name: data.userName,
							room_name: data.roomName,
							chat_content: `${data.userName} joined`,
							status: ChatRoom.GroupChat,
						},
					})
				)
				// Update the room list
			} catch (err) {
				chalk.red(`${err}`)
			}
		}
	})

	socket.on('off_line', async (data: Data) => {
		// Update the chat room of the current offline user
		try {
			await User.updateOne({ _id: ObjectId(data.userId) }, { $set: { current_room_id: '' } })
			//Update the status of all chat rooms for the current user
			await Room.updateMany({ user_id: data.userId }, { $set: { current_status: false } })
			// Update the number of users currently online in the chat room
			await Room.updateMany({ room_name: data.roomName }, { $inc: { num: -1 } })
			//Update group chat list
			await updateRoomList()
			// Send an exit message to the current chat room's other users
			socket.broadcast.to(data.roomName).emit(
				'chat_message',
				createAddDispatch(true, {
					action: 'ADD',
					data: {
						user_id: data.userId,
						user_name: data.userName,
						room_name: data.roomName,
						chat_content: `${data.userName} has left`,
						status: ChatRoom.GroupChat,
					},
				})
			)
			// socket leave
			data.status == ChatRoom.GroupChat ? socket.leave(data.roomName) : socket.leave(`${data.roomName?.split('-')[0]}-${data.roomName?.split('-')[1]}`)
		} catch (err) {
			chalk.red(`${err}`)
		}
	})

	socket.on('chat_message', async (data: Data) => {
		try {
			if (data.status == ChatRoom.GroupChat) {
				await Room.updateMany({ room_name: data.roomName, current_status: false }, { $inc: { badge_number: 1 } })
				await updateRoomList()
				await insertChatMessage({
					user_id: data.userId,
					user_name: data.userName,
					room_name: data.roomName,
					chat_content: data.chat_content,
					status: ChatRoom.PrivateChat,
				})
			} else if (data.status == ChatRoom.PrivateChat) {
				const user = await User.findOne({ user_name: data.roomName?.split('-')[1] })
				if (!user?._id) return
				const room = await Room.findOne({ user_id: user._id, room_name: data.roomName })
				if (room != null) {
					await Room.updateOne(
						{
							room_name: data.roomName,
							current_status: false,
						},
						{ $inc: { badge_number: 1 } }
					)
					await updateRoomList()
					await insertChatMessage({
						user_id: data.userId,
						user_name: data.userName,
						room_name: data.roomName,
						chat_content: data.chat_content,
						status: ChatRoom.PrivateChat,
					})
				} else {
					let room_info = new Room({
						user_id: user._id.toString(),
						user_name: data.roomName.split('-')[1],
						room_name: data.roomName,
						status: ChatRoom.PrivateChat,
						num: 0,
						badge_number: 1,
						current_status: false,
					})
					await room_info.save()
					await updateRoomList()
					await insertChatMessage({
						user_id: data.userId,
						user_name: data.userName,
						room_name: data.roomName,
						chat_content: data.chat_content,
						status: ChatRoom.PrivateChat,
					})
				}
			}
		} catch (err) {
			chalk.red(`${err}`)
		}
	})
})

async function leaveRoom(socket: Socket, data: Basic) {
	try {
		await Room.updateMany({ room_name: data.roomName }, { $inc: { num: -1 } })
		socket.broadcast.to(data.roomName).emit(
			'chat_message',
			createAddDispatch(true, {
				action: 'ADD',
				data: {
					user_id: data.userId,
					user_name: data.userName,
					room_name: data.roomName,
					chat_content: `${data.userName} has left`,
					status: ChatRoom.GroupChat,
				},
			})
		)
		data.status == ChatRoom.GroupChat ? socket.leave(data.roomName) : socket.leave(`${data.roomName.split('-')[0]}-${data.roomName.split('-')[1]}`)
	} catch (err) {
		chalk.red(`${err}`)
	}
}

async function insertChatMessage(data: Message) {
	let record = new Records(data)
	const id = record._id
	try {
		await record.save()
		const latestMessage = await Records.findOne({ _id: ObjectId(id) })
		await sendMessageRoomUser(latestMessage as RecordModel)
	} catch (err) {
		console.log('Failed to insert message')
	}
}

async function sendMessageRoomUser(data: RecordModel) {
	io.sockets.in(data.room_name).emit(
		'chat_message',
		createResponse(true, {
			action: 'ADD',
			data,
		})
	)
}

async function updateRoomList() {
	const docs = await Room.find({})
	io.sockets.emit('room_list_all', roomResponse(true, docs))
}
export { http, app }
