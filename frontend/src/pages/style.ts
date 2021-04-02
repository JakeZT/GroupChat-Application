import styled from 'styled-components'
import backgroundImg from '../assets/img/backgroundImage2.png'
export const InputButton = styled.div`
	width: 80px;
	height: 40px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #0db3a4;
	white-space: nowrap;
	border-radius: 0 0 5px 0;
	transition: all 0.3s;
	font-size: 12px;
	color: #ffffff;
	text-align: center;
	position: relative;

	&::before {
		content: ' ';
		position: absolute;
		top: 50%;
		left: 50%;
		opacity: 0;
		width: 100%;
		height: 100%;
		border: 0px;
		border-color: #000;
		background-color: #000;
		border-radius: inherit;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}
	&:hover::before {
		opacity: 0.1;
	}
	&:active::before {
		opacity: 0.2;
	}
`
export const ContentList = styled.div`
	width: 30px;
	min-width: 30px;
	height: 30px;
	min-height: 30px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	& > img {
		height: 100%;
	}
`
export const Container = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: -webkit-linear-gradient(left top, #67c8b7, #3577cd); /* Safari 5.1 - 6.0 */
	background: -o-linear-gradient(bottom right, #67c8b7, #3577cd); /* Opera 11.1 - 12.0 */
	background: -moz-linear-gradient(bottom right, #67c8b7, #3577cd); /* Firefox 3.6 - 15 */
	background: linear-gradient(to bottom right, #67c8b7, #3577cd);
`

export const UserInfo = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin: 3px 0 0 5px;
`
export const InputContainer = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
`
export const InputWrapper = styled.div`
	width: calc(100% - 80px);
	padding: 10px;
	& > input {
		width: 100%;
		height: 40px;
		outline: none;
		border: 0px;
	}
	& > input::placeholder {
		font-size: 12px;
		color: #b8cee2;
	}
`
export const ContentScroll = styled.div`
	width: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	height: calc(100% - 90px);
	border-bottom: 1px #f1f2f3 solid;
	padding: 5px;
	&::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background-color: #1bb2b7;
	}
	&::-webkit-scrollbar-track {
		border-radius: 10px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background-color: #c2eeed;
	}
`
export const ChatRoomTitle = styled.div`
	width: 100%;
	height: 50px;
	border-bottom: 1px #f1f2f3 solid;
	padding: 5px;
	display: flex;
	align-items: center;
	font-size: 13px;
`
export const ChatContent = styled.div`
	width: 100%;
	margin-bottom: 5px;
	// background-image: url(${backgroundImg});
`

export const SystemMessage = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 10px 0;
	& > span {
		display: inline-block;
		width: 200px;
		padding: 3px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 10px;
		text-align: center;
		background-color: #dfe0e1;
		border-radius: 2px;
	}
`

export const UserName = styled.div`
	font-size: 12px;
	white-space: nowrap;
`

const average = `
min-height: 40px;
display: inline-block;
border-radius: 5px;
background-color: #0db3a4;
max-width: 90%;
font-size: 12px;
color: #ffffff;
padding: 10px;
margin-top: 5px;
line-height: 20px;
word-wrap: break-word;
word-break: break-all;
`
export const UserText = styled.div`
	${average}
`
export const UserTextSpan = styled.div`
	${average}
`
