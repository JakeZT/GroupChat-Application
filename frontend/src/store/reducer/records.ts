import { Reducer, Dispatch } from 'redux'
import { Message } from '../../types/objectType'
import { CombinedReducer } from '../../pages/index'
export const initialState: Array<Message> = [
	{
		user_id: '',
		user_name: '',
		room_name: '',
		chat_content: '',
		status: 0,
		createTime: '',
	},
]
export enum RECORD_ACTION {
	SET_RECORDS = 'SET_RECORDS',
	ADD_RECORD = 'ADD_RECORD',
}
interface SetRecordAction {
	type: typeof RECORD_ACTION.SET_RECORDS
	data: Array<Message>
}

interface SetAddAction {
	type: typeof RECORD_ACTION.ADD_RECORD
	data: Array<Message>
}
export const setRecordAction = (data: Array<Message>) => {
	return (dispatch: Dispatch, getState: () => CombinedReducer) => {
		const Data = [...data]
		return dispatch({
			type: RECORD_ACTION.SET_RECORDS,
			data: Data,
		})
	}
}
export const addRecordAction = (data: Array<Message>) => {
	return (dispatch: Dispatch, getState: () => CombinedReducer) => {
		const Data = [...getState().records, data] as Array<Message>
		return dispatch({
			type: RECORD_ACTION.SET_RECORDS,
			data: Data,
		})
	}
}
const reducer: Reducer<Array<Message>, SetRecordAction | SetAddAction> = (state = initialState, action) => {
	switch (action.type) {
		case RECORD_ACTION.SET_RECORDS:
			return action.data
		case RECORD_ACTION.ADD_RECORD:
			return action.data
		default:
			return state
	}
}
export { reducer as recordReducer }
