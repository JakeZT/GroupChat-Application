import * as mongoose from 'mongoose'
let UserSchema = new mongoose.Schema(
	{
		user_name: {
			type: String,
			unique: true,
			required: true,
		},
		current_room_id: String,
		socket_id: String,
		roomName: String,
		status: Number,
	},
	{
		timestamps: {
			createdAt: 'createTime',
			updatedAt: 'updateTime',
		},
	}
)
export type UserModel = mongoose.Document & {
	user_name: string
	current_room_id: string
	socket_id: string
	status: number
}
let User = mongoose.model<UserModel>('User', UserSchema)

export default User
