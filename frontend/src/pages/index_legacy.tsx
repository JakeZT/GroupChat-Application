import React, { KeyboardEvent } from 'react'
import { connect } from 'react-redux' // 中间件
import { User } from '../component/User'
import 'antd/dist/antd.css'
import faker from 'faker'
import { Dispatch } from 'redux'
import { ResData, DataExt, RoomModule, UserModule, _User, Message, RoomModel } from '../types/objectType'
import { message, Modal, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { RECORD_ACTION, setRecordAction, addRecordAction } from '../store/reducer/records'
import { ROOM_ACTION, updateRoomAction, updateRoomListAction } from '../store/reducer/room'
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
		room_id: string
		room_item: RoomModel
	}
	// dispatch: Dispatch
	updateRoom: any
	addRecord: any
	setRecord: any
	updateRoomList: any
}

interface Item {
	_id?: string
	user_id: string
	user_name: string
	room_name?: string
	status: number
}
interface _UserInfo {
	_id: string
	user_name: string
	socket_id?: string
}
interface State {
	inputVal: string
	isModalVisible: boolean
	userInfo: _UserInfo
	inputting?: boolean
}
class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			inputVal: faker.name.findName(),
			isModalVisible: false,
			userInfo: { _id: '', user_name: '', socket_id: '' },
		}
	}
	// updateRoomList: (newData: any) => dispatch(updateRoomListAction(newData)),
	register = () => {
		const self = this
		Modal.info({
			title: 'Enter your username',
			content: (
				<div>
					<Input defaultValue={self.state.inputVal} placeholder='username' onChange={self.nameChange} prefix={<UserOutlined />} />
				</div>
			),
			onOk() {
				let name = String(self.state.inputVal).trim()
				if (name.length === 0) {
					message.error('Name cannot be empty')
					self.setState({ inputVal: '' })
					self.register()
					return
				}
				if (name.length > 20) {
					message.error('Up to 20 characters')
					self.setState({ inputVal: '' })
					self.register()
					return
				}
				socket.emit('chat_reg', name)
				self.setState({ inputVal: '' })
			},
		})
	}

	nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		this.setState({ inputVal: value })
	}
	componentDidMount() {
		console.log(this.props)
		if (localStorage.getItem('userInfo')) {
			let localUserInfo = localStorage.getItem('userInfo') as string
			const parsedUserInfo = JSON.parse(localUserInfo) as _UserInfo
			socket.emit('login', parsedUserInfo._id)
		} else {
			this.register()
		}
		this.socketEvent()
		this.listenClose()
	}

	// Send messages
	sendMessage = () => {
		let ele = document.getElementById('message') as HTMLInputElement
		if (!ele.value) return message.info('message cannot be empty.')
		socket.emit('chat_message', {
			roomName: this.props.room.room_item.room_name,
			userId: this.state.userInfo._id,
			userName: this.state.userInfo.user_name,
			chat_content: ele.value,
			status: this.props.room.room_item.status,
		})
		// clear input value
		ele.value = ''
	}

	// alway update the position to the bottom
	updatePosition = () => {
		let ele = document.getElementsByClassName('chat_body_room_content_scroll')[0]
		ele.scrollTop = ele.scrollHeight
	}

	// listening the offline event
	listenClose = () => {
		if (navigator.userAgent.indexOf('Firefox')) {
			window.onbeforeunload = () => {
				socket.emit('off_line', {
					userName: this.state.userInfo.user_name,
					userId: this.state.userInfo._id,
					roomName: this.props.room.room_item.room_name,
					status: this.props.room.room_item.status,
				})
			}
		} else {
			window.onunload = () => {
				socket.emit('off_line', {
					userName: this.state.userInfo.user_name,
					userId: this.state.userInfo._id,
					roomName: this.props.room.room_item.room_name,
					status: this.props.room.room_item.status,
				})
			}
		}
	}

	socketEvent = () => {
		// login response
		socket.on('login', (socket_id: string) => {
			console.log(socket_id)
			let localUserInfo = localStorage.getItem('userInfo') as string
			let parsedInfo = JSON.parse(localUserInfo) as _UserInfo
			parsedInfo.socket_id = socket_id
			localStorage.setItem('userInfo', JSON.stringify(parsedInfo))
			this.setState(
				{
					userInfo: parsedInfo,
				},
				() => {
					console.log(this.state.userInfo)
					socket.emit('get_room_list', parsedInfo._id)
				}
			)
		})
		// register response
		socket.on('chat_reg', (apply: UserModule<_UserInfo>) => {
			if (apply.code === RESPONSE_TYPE.SUCCESS) {
				localStorage.setItem('userInfo', JSON.stringify(apply.data))
				this.setState(
					{
						userInfo: apply.data,
					},
					() => {
						socket.emit('get_room_list', this.state.userInfo._id)
					}
				)
			} else {
				message.info(apply.data)
				this.register()
			}
		})
		// Get the chatRoom List
		socket.on('get_room_list', async (apply: ResData<Item>) => {
			console.log(apply)
			let room_list = apply.data.data.filter((item) => item.user_id === this.state.userInfo._id)
			let room_id = room_list[0]?._id?.toString()
			let room_item = room_list[0]
			const Data = {
				room_info: {
					room_id,
					room_item,
				},
				room_list,
			}
			console.log(Data)
			this.props.updateRoom(Data)
			console.log(this.props.room)
			if (apply.data.once) {
				socket.emit('join', {
					roomName: GROUP_INFO.ROOM_NAME,
					roomId: this.props.room.room_id,
					userId: this.props.room.room_item._id,
					userName: this.state.userInfo.user_name,
					status: GROUP_INFO.STATUS,
				})
			}
		})
		// update room list
		socket.on('room_list_all', (apply: RoomModule) => {
			const Data = {
				room_list: apply.data.filter((item) => item.user_id === this.state.userInfo._id),
			}
			this.props.updateRoomList(Data)
		})
		socket.on('chat_message', (res: DataExt) => {
			console.log(res)
			if (res.data.action === ROOM_ACTION.SET) {
				this.props.setRecord(res.data.data)
			} else if (res.data.action === ROOM_ACTION.ADD) {
				this.props.addRecord(res.data.data)
			}
			// update position
			this.updatePosition()
		})
	}

	debounce = (fn: Function, wait: number) => {
		let timer: number | null
		let context = this
		return function () {
			const args = arguments
			if (timer) {
				clearTimeout(timer)
				timer = null
			}

			timer = window.setTimeout(() => {
				fn.apply(context, args)
			}, wait)
		}
	}

	render() {
		let { room, records } = this.props
		let { userInfo } = this.state
		let roomName = room.room_item.room_name
		return (
			<Container>
				<div className='chat_body'>
					<User socket={socket} userInfo={userInfo} />
					<div className='chat_body_room'>
						<ChatRoomTitle className='chat_body_room_title'>
							Chatting with
							<span style={{ color: 'rgb(13, 179, 164)' }}>
								{room.room_item.status ? roomName.replace(userInfo.user_name as string, '').replace('-', '') : roomName}
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
									onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => (e.key === 'Enter' ? this.sendMessage() : '')}
								/>
							</InputWrapper>
							<InputButton style={{ borderRadius: '8px' }} onClick={this.sendMessage}>
								Send
							</InputButton>
						</InputContainer>
					</div>
				</div>
			</Container>
		)
	}
}
interface CombinedReducer {
	records: Array<Message>
	room: {
		room_info: {
			room_id: string
			room_item: RoomModel
		}
	}
}
function mapStateToProps(state: CombinedReducer) {
	return {
		room: state.room.room_info,
		records: state.records,
	}
}
const mapDispatchToProps = (dispatch: any) => {
	return {
		updateRoom: (newData: any) => dispatch(updateRoomAction(newData)),
		setRecord: (data: any) => dispatch(setRecordAction(data)),
		addRecord: (data: any) => dispatch(addRecordAction(data)),
		updateRoomList: (newData: any) => dispatch(updateRoomListAction(newData)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
