interface _ResponseType {
	readonly SUCCESS: number
	readonly FAIL: number
}
interface _ChatRoom {
	readonly GroupChat: number
	readonly PrivateChat: number
}
export const RESPONSE_TYPE: _ResponseType = {
	SUCCESS: 200,
	FAIL: 100,
}
export const CHATROOM: _ChatRoom = {
	GroupChat: 0,
	PrivateChat: 1,
}

export const GROUP_INFO: {
	ROOM_NAME: string
	STATUS: number
} = {
	ROOM_NAME: 'All',
	STATUS: 0,
}
