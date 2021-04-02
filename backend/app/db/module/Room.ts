import * as mongoose from 'mongoose'
let RoomSchema = new mongoose.Schema(
	{
		user_id: String,
		user_name: String,
		room_name: String,
		status: Number,
		num: Number,
		badge_number: Number,
		current_status: Boolean,
		roomName: String,
	},
	{
		timestamps: {
			createdAt: 'createTime',
			updatedAt: 'updateTime',
		},
	}
)

export type RoomModel = mongoose.Document & {
	user_id: string
	user_name: string
	room_name: string
	status: number
	num: number
	badge_number: number
	current_status: boolean
}
let Room = mongoose.model<RoomModel>('Room', RoomSchema)
export default Room
