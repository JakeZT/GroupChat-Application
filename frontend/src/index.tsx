import ReactDOM from 'react-dom'
import './assets/scss/index.scss'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
// import App from './pages/index2'
// import App from './pages/test'
// import App from './pages/input'
import App from './pages/index'
// import App from './pages'
import reducer from './store'
import thunk from 'redux-thunk'

const store = createStore(reducer, compose(applyMiddleware(thunk)))

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
