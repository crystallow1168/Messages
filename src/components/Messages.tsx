import React, { Component } from 'React';
import '../styles/Messages.css';
import Message from './Message';

import { messages as data } from '../../data.json';

type State = {
	page: number;
	messages: MessageType[];
};

export type MessageType = {
	sentAt: string;
	uuid: string;
	content: string;
	senderUuid: string;
};

class Messages extends Component {
	state: State = {
		page: 0,
		messages: []
	};

	componentDidMount() {
		this.filtered(data);
	}

	filtered = (messages: MessageType[]): void => {
		const storage: any = {};
		const filteredMessages = [];

		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];

			if (!storage[message.uuid]) {
				storage[message.uuid] = [message.content];
				filteredMessages.push(message);
			} else {
				if (!storage[message.uuid].includes(message.content)) {
					storage[message.uuid].push(message.content);
					filteredMessages.push(message);
				}
			}
		}

		this.setState({
			messages: filteredMessages
		});
	};

	deleteMessage = (idx: number): void => {
		console.log(idx);
		const messages = [...this.state.messages];
		messages.splice(idx, 1);

		this.setState({
			messages
		});
	};

	render() {
		const { messages } = this.state;
		console.log(messages);

		return (
			<div className="mainContainer">
				<div>
					{messages.map((message, idx) => {
						return (
							<Message
								message={message}
								key={idx}
								id={idx}
								deleteMessage={this.deleteMessage}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}

export default Messages;
