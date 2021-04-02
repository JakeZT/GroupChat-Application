import { combineReducers } from 'redux'
import { recordReducer as room } from './reducer/room'
import { recordReducer as records } from './reducer/records'

export default combineReducers({
	room,
	records,
})
