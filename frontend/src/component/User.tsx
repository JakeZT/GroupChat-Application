import { useState } from 'react'
import { connect } from 'react-redux'
import userIcon from '../assets/img/userIcon1.jpg'
import Icon from '../assets/img/messages.png'
import hideIcon from '../assets/img/showMore.png'
import { socket } from '../pages/index'
import { Dispatch } from 'redux'
import { UserList, UserStatus } from './style'
import { GROUP_INFO } from '../types/statusType'
import { User as UserType } from '../store/reducer/room'
export interface Item {
	_id: string
	status: boolean
	room_name: string
	current_status: boolean
	num: number
	badge_number: number
}
export interface Props {
	records?: any
	userInfo: {
		_id: string
		user_name: string
	}
	room_list: Array<Item>
	room: {
		room_item: {
			user_name: string
			status: number
			room_name: string
		}
		room_id: string
		user_info: UserType
	}
	dispatch: Dispatch
	socket: typeof socket
}

const _User = function (props: Props) {
	const [show_tab, setShow_tab] = useState(false)
	let { room, room_list } = props

	const showTab = () => setShow_tab(!show_tab)

	return (
		<div className='chat_body_tab' style={show_tab ? { width: '70%' } : {}}>
			<div className='chat_body_title show_text'>
				<span style={{ color: '#0db3a4', fontWeight: 'bold' }}>{room.room_item?.user_name || 'Chat room！'}</span>
			</div>
			<div className='chat_body_title show_img'>
				<img src={userIcon} alt='' width='28px' height='28px' />
			</div>
			<div className='chat_body_user'>
				{room_list?.map((item, index) => {
					return (
						<UserList key={index} style={room.room_id === item._id ? { backgroundColor: 'rgba(0,0,0,0.1)' } : {}}>
							<div className='chat_body_user_head_warp' style={{ padding: 0, borderBottom: '1px #f1f2f3 solid', borderRadius: 0 }}>
								<div className='chat_body_user_head' style={{ marginLeft: '5px' }}>
									<img src={Icon} alt='' />
								</div>
								<div className='chat_body_user_name'>
									<p>{item.status ? item.room_name.replace(props.room.user_info.user_name, '').replace('-', '') : item.room_name}</p>
									{item.status ? (
										<div>
											<span style={!item.current_status ? { backgroundColor: 'darkgray' } : {}} className='circle'></span>
											<span style={!item.current_status ? { color: 'darkgray' } : {}} className='user_status'>
												{item.current_status ? 'online' : 'offline'}
											</span>
										</div>
									) : (
										<div>
											<span className='circle'></span>
											<UserStatus> online : {item.num} </UserStatus>
										</div>
									)}
								</div>
								{item.badge_number > 0 ? (
									<div className='chat_body_user_list_message_num'>
										<span>{item.badge_number > 99 ? '99+' : item.badge_number}</span>
									</div>
								) : (
									''
								)}
							</div>
						</UserList>
					)
				})}
			</div>
			<div className='chat_body_user_add show_img' onClick={() => {}}>
				<img src={hideIcon} alt='' width='20px' height='20px' />
			</div>
			{!show_tab ? (
				<div className='chat_body_tab_show' onClick={showTab}>
					<img src={userIcon} alt='' width='27px' />
				</div>
			) : (
				<div className='chat_body_tab_show' onClick={showTab}>
					<img src={userIcon} alt='' width='35px' />
				</div>
			)}
		</div>
	)
}

function mapStateToProps(state: any) {
	return {
		room: state.room,
		room_list: state.room.room_list,
	}
}

export const User = connect(mapStateToProps)(_User)
