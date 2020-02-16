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
			<div className="innerContainer">
				<div>{time}</div>
				<div>uuid: {uuid}</div>
				<div>content: {content} </div>
				<div>{senderUuid}</div>
			</div>
			<div className="button">
				<button
					type="button"
					className="btn btn-danger"
					onClick={() => deleteMessage(id)}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default Message;
