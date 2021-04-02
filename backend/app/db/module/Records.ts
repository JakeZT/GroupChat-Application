import * as mongoose from 'mongoose'
let RecordSchema = new mongoose.Schema(
	{
		user_id: String,
		user_name: String,
		room_name: String,
		chat_content: String,
		status: Number,
	},
	{
		timestamps: {
			createdAt: 'createTime',
			updatedAt: 'updateTime',
		},
	}
)

export type RecordModel = mongoose.Document & {
	user_id: string
	user_name: string
	room_name: string
	chat_content: string
	status: number
}
let Records = mongoose.model<RecordModel>('Records', RecordSchema)
export default Records
