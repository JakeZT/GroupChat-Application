export interface Basic {
	user_name: string
	status: number
	user_id?: string
	room_name?: string
}
export interface DataType<T> {
	code?: number
	msg: string
	action?: string
	data: T
}
export type ResData<T> = DataType<{
	once?: boolean
	data: Array<T>
}>

export interface RoomModel {
	_id?: string
	user_id: string
	user_name: string
	room_name?: string
	status: number
	num?: number
	badge_number?: number
	current_status?: boolean
}

export type DataExt = DataType<DataType<Message>>

export type RoomModule = DataType<Array<Room>>

export interface Room extends Basic {
	num: number
	badge_number: number
	current_status: boolean
	roomName?: string
}
export type UserModule<T> = DataType<T>

export interface _User extends Basic {
	current_room_id: string
	socket_id: string
}

export interface Message extends Basic {
	chat_content: string
	createTime?: string
}
