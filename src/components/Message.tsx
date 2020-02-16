//`sentAt` in either ascending or descending order.

import React from 'React';
import '../styles/Message.css';
import { MessageType } from './Messages';
import moment from 'moment';

type MessageProps = {
	message: MessageType;
	id: number;
	deleteMessage: (messageIdx: number) => void;
};

const Message = (props: MessageProps): JSX.Element => {
	const { sentAt, uuid, content, senderUuid } = props.message;
	const { id, deleteMessage } = props;
	const time = moment(sentAt).format('dddd, MMMM Do YYYY');

	return (
		<div className="messageContainer">
			<div className="leftContainer">
				<div>UUID: {uuid}</div>
				<div>Content: {content} </div>
				<div>Sender UUID: {senderUuid}</div>
			</div>
			<div className="rightContainer">
				<button
					type="button"
					className="btn btn-outline-primary"
					onClick={() => deleteMessage(id)}
				>
					Delete
				</button>
				<div className="time">sent: {time}</div>
			</div>
		</div>
	);
};

export default Message;
