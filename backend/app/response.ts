import { DataExt, OnceRes } from './objectType'
import { UserModel } from './db/module/User'
import { RoomModel } from './db/module/Room'
import { RecordModel } from './db/module/Records'
interface ResponseType {
	readonly SUCCESS: number
	readonly FAIL: number
}
const RESPONSE_TYPE: ResponseType = {
	SUCCESS: 200,
	FAIL: 100,
}
const sendRes = (status: boolean | number, data: any) => {
	let status_code: boolean | number
	if (typeof status === 'boolean') {
		status_code = status ? RESPONSE_TYPE.SUCCESS : RESPONSE_TYPE.FAIL
	} else {
		status_code = status
	}
	return {
		code: status_code,
		data,
		msg: status ? 'success' : 'error',
	}
}

export const createResponse = (status: boolean, data: DataExt) => sendRes(status, data)
export const roomListResponse = (status: boolean, data: { once: boolean; data: RoomModel[] }) => sendRes(status, data)
export const roomResponse = (status: boolean, data: RoomModel[]) => sendRes(status, data)
export const createRoomResponse = (status: boolean, data: RoomModel) => sendRes(status, data)
export const alertResponse = (status: boolean, data: string) => sendRes(status, data)
export const createDispatch = (status: boolean, data: { action: string; data: RecordModel[] }) => sendRes(status, data)
export const createAddDispatch = (status: boolean, data: DataExt) => sendRes(status, data)

export const RegisterRes = (status: boolean, data: UserModel) => sendRes(status, data)
export const NewUserRes = (status: boolean, data: OnceRes) => sendRes(status, data)
