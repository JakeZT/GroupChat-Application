import React, { KeyboardEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { User } from '../component/User'
import 'antd/dist/antd.css'
import faker from 'faker'
import { ResData, DataExt, RoomModule, UserModule, _User, Message, RoomModel } from '../types/objectType'
import { message, Modal, Button, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { setRecordAction, addRecordAction } from '../store/reducer/records'
import { ROOM_ACTION, updateRoomAction, updateUserInfoAction, updateRoomListAction, RoomState, User as UserType, LocalStorage } from '../store/reducer/room'
import userIcon from '../assets/img/userIcon1.jpg'
import userIcon2 from '../assets/img/userIncon2.png'
import { CHATROOM, RESPONSE_TYPE } from '../types/statusType'
import { GROUP_INFO } from '../types/statusType'
import {
	InputButton,
	ContentScroll,
	Container,
	ChatContent,
	ChatRoomTitle,
	InputContainer,
	InputWrapper,
	ContentList,
	UserInfo,
	UserName,
	UserText,
	SystemMessage,
	UserTextSpan,
} from './style'
import io from 'socket.io-client'

const server_url = 'http://localhost:3001'
export const socket = io.connect(server_url, { path: '/mysocket' })
interface Props {
	records: Array<Message>
	room: {
		room_info: {
			room_id: string
			room_item: RoomModel
		}
		user_info: UserType
	}
	// dispatch: Dispatch
	updateRoom: (newData: RoomState) => Promise<unknown>
	addRecord: (data: Message) => Promise<unknown>
	setRecord: (data: Message) => Promise<unknown>
	updateRoomList: (newData: RoomState) => Promise<void>
	updateUserInfo: (data: LocalStorage) => Promise<unknown>
}

interface Item {
	_id?: string
	user_id: string
	user_name: string
	room_name?: string
	status: number
}

const App: React.FC<Props> = (props) => {
	const [inputVal, setInputVal] = useState(faker.name.findName())
	const [isModalVisible, setIsModalVisible] = useState(false)
	let [userInfo, setUserInfo] = useState(() => {
		return props.room.user_info
	})
	let [flag, setFlag] = useState(false)
	let { room, records, updateRoom, updateUserInfo, addRecord, setRecord, updateRoomList } = props

	const roomName = room.room_info.room_item.room_name as string
	const userLogin = () => {
		let name = String(inputVal).trim()
		if (name.length === 0) {
			message.error('Name cannot be empty')
			return
		} else if (name.length > 20) {
			message.error('Up to 20 characters')
			return
		}
		message.success('Successfully set your username')
		socket.emit('chat_reg', name)
		setIsModalVisible(false)
		setInputVal('')
	}

	useEffect(() => {
		if (!localStorage.getItem('userInfo')) {
			setIsModalVisible(true)
		}
		if (flag === false) {
			if (localStorage.getItem('userInfo')) {
				let localUserInfo = localStorage.getItem('userInfo') as string
				const parsedUserInfo = JSON.parse(localUserInfo) as UserType
				socket.emit('login', parsedUserInfo._id)
			} else {
				setIsModalVisible(true)
			}
			socketEvent()
			setFlag(true)
		}
		listenClose()
	}, [userInfo, flag])

	useEffect(() => {
		if (flag === false) {
			const temp = JSON.parse(localStorage.getItem('userInfo') as string)
			if (temp) {
				socket.emit('get_room_list', temp._id)
			}
		}
	}, [userInfo, flag])

	// Send messages
	const sendMessage = () => {
		let ele = document.getElementById('message') as HTMLInputElement
		if (!ele.value) return message.info('message cannot be empty.')
		socket.emit('chat_message', {
			roomName: props.room.room_info.room_item.room_name,
			userId: props.room.user_info._id,
			userName: props.room.user_info.user_name,
			chat_content: ele.value,
			status: props.room.room_info.room_item.status,
		})
		// clear input value
		ele.value = ''
	}

	// alway update the position to the bottom
	const updatePosition = () => {
		let ele = document.getElementsByClassName('chat_body_room_content_scroll')[0]
		ele.scrollTop = ele.scrollHeight
	}

	// listening the offline event
	const listenClose = () => {
		const temp = JSON.parse(localStorage.getItem('userInfo') as string)
		if (navigator.userAgent.indexOf('Firefox')) {
			window.onbeforeunload = () => {
				socket.emit('off_line', {
					userName: temp.user_name,
					userId: temp._id,
					roomName: GROUP_INFO.ROOM_NAME,
					status: GROUP_INFO.STATUS,
				})
			}
		} else {
			window.onunload = () => {
				socket.emit('off_line', {
					userName: temp.user_name,
					userId: temp._id,
					roomName: GROUP_INFO.ROOM_NAME,
					status: GROUP_INFO.STATUS,
				})
			}
		}
	}

	const socketEvent = () => {
		socket.on('login', (socket_id: string) => {
			let localUserInfo = localStorage.getItem('userInfo') as string
			let parsedInfo = JSON.parse(localUserInfo) as UserType
			parsedInfo.socket_id = socket_id
			localStorage.setItem('userInfo', JSON.stringify(parsedInfo))
			updateUserInfo(parsedInfo)
			setUserInfo(parsedInfo)
		})
		// register response
		socket.on('chat_reg', (apply: UserModule<UserType>) => {
			if (apply.code === RESPONSE_TYPE.SUCCESS) {
				localStorage.setItem('userInfo', JSON.stringify(apply.data))
				updateUserInfo(apply.data)
				setUserInfo(apply.data)
			} else {
				message.info(apply.data)
				message.error('Failed to register')
				setIsModalVisible(true)
			}
		})
		// Get the chatRoom List
		socket.on('get_room_list', async (apply: ResData<Item>) => {
			let temp = JSON.parse(localStorage.getItem('userInfo') as string)
			let room_list = apply.data.data.filter((item) => item.user_id === temp._id)
			let room_id = room_list[0]?._id?.toString() as string
			let room_item = room_list[0]
			const Data = {
				room_info: {
					room_id,
					room_item,
				},
				room_list: room_list,
				userInfo,
			}
			if (apply.data.once) {
				socket.emit('join', {
					roomName: GROUP_INFO.ROOM_NAME,
					roomId: Data.room_info.room_id,
					userId: temp._id,
					userName: temp.user_name,
					status: GROUP_INFO.STATUS,
				})
			}
			updateRoom(Data)
		})

		socket.on('room_list_all', (apply: RoomModule) => {
			const temp = JSON.parse(localStorage.getItem('userInfo') as string)
			const Data = {
				room_list: apply.data.filter((item) => item.user_id === temp._id),
			}
			updateRoomList(Data)
		})
		socket.on('chat_message', (res: DataExt) => {
			if (res.data.action === ROOM_ACTION.SET) {
				setRecord(res.data.data)
			} else if (res.data.action === ROOM_ACTION.ADD) {
				addRecord(res.data.data)
			}
			// update position
			updatePosition()
		})
	}

	return (
		<Container>
			<Modal
				closable={false}
				keyboard={false}
				maskClosable={false}
				destroyOnClose={true}
				footer={false}
				title='Enter your username'
				visible={isModalVisible}
			>
				<Input defaultValue={inputVal} placeholder='username' prefix={<UserOutlined />} onChange={(e) => setInputVal(e.target.value)} />
				<div style={{ height: '20px', marginTop: '20px' }}>
					<Button style={{ float: 'right' }} onClick={userLogin} type='primary'>
						OK
					</Button>
				</div>
			</Modal>
			<div className='chat_body'>
				<User socket={socket} userInfo={userInfo} />
				<div className='chat_body_room'>
					<ChatRoomTitle className='chat_body_room_title'>
						Chatting with
						<span style={{ color: 'rgb(13, 179, 164)' }}>
							{room.room_info.room_item.status ? roomName?.replace(userInfo.user_name as string, '').replace('-', '') : roomName}
						</span>
					</ChatRoomTitle>

					<ContentScroll className='chat_body_room_content_scroll'>
						<ChatContent>
							{records?.map((item: Message, index: number) => (
								<div key={index}>
									{item.status === CHATROOM.GroupChat ? (
										<SystemMessage>
											<span>{item.chat_content}</span>
										</SystemMessage>
									) : userInfo._id === item.user_id ? (
										<div className='chat_body_room_content_list'>
											<UserInfo className='user_info_mine'>
												<UserName style={{ textAlign: 'right', marginRight: '5px' }}>
													<span className='chat_specific_time' style={{ marginRight: '10px' }}>
														{new Date(item.createTime as string).toLocaleString('en-us')}
													</span>
													{item.user_name}
												</UserName>
												<UserText>{item.chat_content}</UserText>
											</UserInfo>
											<ContentList>
												<img src={userIcon} alt='' />
											</ContentList>
										</div>
									) : (
										<div className='chat_body_room_content_list'>
											<ContentList>
												<img src={userIcon2} alt='' />
											</ContentList>
											<UserInfo>
												<UserName>
													{item.user_name}
													<span className='chat_specific_time' style={{ marginLeft: '10px' }}>
														{new Date(item.createTime as string).toLocaleString('en-us')}
													</span>
												</UserName>
												<div>
													<UserTextSpan>{item.chat_content}</UserTextSpan>
												</div>
											</UserInfo>
										</div>
									)}
								</div>
							))}
						</ChatContent>
					</ContentScroll>
					<InputContainer>
						<InputWrapper>
							<input
								id='message'
								type='text'
								placeholder='messages...'
								onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => (e.key === 'Enter' ? sendMessage() : '')}
							/>
						</InputWrapper>
						<InputButton style={{ borderRadius: '8px' }} onClick={sendMessage}>
							Send
						</InputButton>
					</InputContainer>
				</div>
			</div>
		</Container>
	)
}
export interface CombinedReducer {
	records: Array<Message>
	room: {
		room_info: {
			room_id: string
			room_item: RoomModel
		}
		user_info: UserType
	}
}
function mapStateToProps(state: CombinedReducer) {
	return {
		room: state.room,
		records: state.records,
	}
}
const mapDispatchToProps = (dispatch: any) => {
	return {
		updateRoom: (newData: RoomState) => dispatch(updateRoomAction(newData)),
		setRecord: (data: Array<Message>) => dispatch(setRecordAction(data)),
		addRecord: (data: Array<Message>) => dispatch(addRecordAction(data)),
		updateRoomList: (newData: RoomState) => dispatch(updateRoomListAction(newData)),
		updateUserInfo: (data: LocalStorage) => dispatch(updateUserInfoAction(data)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(App as React.FC)
