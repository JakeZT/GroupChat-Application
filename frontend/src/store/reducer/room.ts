import { Reducer, AnyAction, Dispatch } from 'redux'
import { RoomModel } from '../../types/objectType'
import cloneDeep from 'clone-deep'
import { CombinedReducer } from '../../pages/index'
export interface User {
	_id: string
	user_name: string
	socket_id?: string
}
export interface RoomState {
	room_info?: {
		room_id?: string
		room_item: RoomModel
	}
	room_list?: Object[]
	user_info?: User
}

export let initialState: RoomState = {
	room_info: {
		room_id: '',
		room_item: {
			_id: '',
			room_name: '',
			num: 0,
			status: 0,
			user_name: '',
			user_id: '',
			current_status: false,
			badge_number: 0,
		},
	},
	room_list: [
		{
			user_name: '',
			room_list: [
				{
					room_name: '',
				},
			],
		},
	],
	user_info: { _id: '', user_name: '', socket_id: '' },
}

export enum ROOM_ACTION {
	GET = 'GET',
	SET = 'SET',
	ADD = 'ADD',
}

interface SetAction {
	type: typeof ROOM_ACTION.SET
	data: Object
}

interface Iterable<T> {
	[Symbol.iterator](): Iterator<T>
}
export interface LocalStorage {
	user_name: string
	_id: string
	current_room_id?: string
	__v?: 0
	socket_id?: string
	updateTime?: string
	createTime?: string
}
export const updateRoomAction = (data: RoomState) => {
	return (dispatch: Dispatch, getState: () => CombinedReducer) => {
		const Data = Object.assign({}, getState().room, data)
		const newData = cloneDeep(Data)
		return dispatch({
			type: ROOM_ACTION.SET,
			data: newData,
		})
	}
}
export const updateUserInfoAction = (data: LocalStorage) => {
	return (dispatch: Dispatch, getState: () => CombinedReducer) => {
		const Data = cloneDeep(getState().room)
		Data.user_info = data
		return dispatch({
			type: ROOM_ACTION.SET,
			data: Data,
		})
	}
}
export const updateRoomListAction = (data: RoomState) => {
	return (dispatch: Dispatch, getState: () => CombinedReducer) => {
		const Data = Object.assign({}, getState().room, data)
		const newData = cloneDeep(Data)
		return dispatch({
			type: ROOM_ACTION.SET,
			data: newData,
		})
	}
}
const reducer: Reducer<RoomState, SetAction> = (state: any = initialState, action) => {
	switch (action.type) {
		case ROOM_ACTION.SET:
			return cloneDeep(action.data)
		default:
			return cloneDeep(state)
	}
}
export { reducer as recordReducer }
