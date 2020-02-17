import React from 'react';
import '../styles/Message.css';
import { MessageType } from './MessagesContainer';
import moment from 'moment';

type MessageProps = {
	message: MessageType;
	deleteMessage: (messageIdx: string) => void;
};

const Message = (props: MessageProps): JSX.Element => {
	const { sentAt, content, senderUuid } = props.message;
	const { deleteMessage } = props;
	const time = moment(sentAt).format('dddd MMMM Do, YYYY');

	return (
		<div className="messageContainer">
			<div className="leftContainer">
				<div>Content: {content} </div>
				<div>Sender UUID: {senderUuid}</div>
			</div>
			<div className="rightContainer">
				<button
					type="button"
					className="btn btn-outline-primary"
					onClick={() => deleteMessage(sentAt)}
				>
					Delete
				</button>
				<div className="time">sent: {time}</div>
			</div>
		</div>
	);
};

export default Message;
