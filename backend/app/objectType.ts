export interface Basic {
	roomName: string
	roomId: string
	userId: string
	userName: string
	status: number
}
export interface Data extends Basic {
	leaveRoom: Basic
	chat_content: string
}
export interface Message {
	user_id: string
	user_name: string
	room_name: string
	chat_content: string
	status: number
}
export interface DataExt {
	action: string
	data: Message
}
export interface OnceRes {
	once: boolean
	data: any[]
	result?: string[]
}
