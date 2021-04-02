import styled from 'styled-components'

export const UserAdd = styled.div`
	width: 100%;
	height: 41px;
	font-size: 12px;
	position: absolute;
	bottom: 0;
	left: 0;
	border-top: 1px #f1f2f3 solid;
	display: flex;
	justify-content: center;
	align-items: center;

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
	&:active::before {
		opacity: 0.1;
	}
`
export const UserStatus = styled.span`
	display: inline-block;
	font-size: 10px;
	color: limegreen;
	margin-left: 3px;
	font-weight: bold;
`
export const UserHead = styled.div`
	width: 40px;
	min-width: 40px;
	height: 40px;
	min-height: 40px;
	border-radius: 5px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	& > img {
		height: 100%;
	}
`
export const UserList = styled.div`
	width: 100%;
	background-color: #fff;
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
	&::before:visited {
		opacity: 0.2;
	}
`
export const ChatTitle = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 13px;
	border-bottom: 1px #f1f2f3 solid;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`
