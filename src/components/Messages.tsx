import React, { Component } from 'React';
import ReactPaginate from 'react-paginate';
import '../styles/Messages.css';
import Message from './Message';

import { messages as data } from '../../data.json';

type State = {
	offset: number;
	messages: MessageType[];
	pageCount: number;
	currentPage: number;
	pageView: MessageType[];
	perPage: number;
};

export type MessageType = {
	sentAt: string;
	uuid: string;
	content: string;
	senderUuid: string;
};

class Messages extends Component {
	state: State = {
		offset: 0,
		messages: [],
		pageCount: Math.ceil(data.length / 5),
		currentPage: 0,
		pageView: [],
		perPage: 5
	};

	componentDidMount() {
		this.filtered(data);
	}

	filtered = (messages: MessageType[]): void => {
		const storage: any = {};
		let filteredMessages = [];

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

		filteredMessages = filteredMessages.sort(
			(a: MessageType, b: MessageType): number => {
				if (a.sentAt > b.sentAt) return 1;
				else if (a.sentAt < b.sentAt) return -1;
				else return 0;
			}
		);

		this.setState(
			{
				messages: filteredMessages
			},
			() => this.handleMessagesForCurrentPage()
		);
	};

	deleteMessage = (idx: number): void => {
		const messages = [...this.state.messages];
		messages.splice(idx, 1);

		this.setState(
			{
				messages
			},
			() => this.handleMessagesForCurrentPage()
		);
	};

	handlePageClick = (page: any) => {
		let selected = page.selected;
		let offset = Math.ceil(selected * this.state.perPage);

		this.setState(
			{
				currentPage: selected,
				offset: offset
			},
			() => {
				this.handleMessagesForCurrentPage();
			}
		);
	};

	handleMessagesForCurrentPage() {
		let messages = this.state.messages.slice(
			this.state.offset,
			this.state.offset + this.state.perPage
		);
		this.setState({ pageView: messages });
		console.log(this.state.pageView);
	}

	render() {
		const { pageView, pageCount, perPage } = this.state;

		return (
			<>
				<div className="paginationContainer">
					<ReactPaginate
						previousLabel={'←'}
						nextLabel={'→'}
						pageCount={pageCount}
						marginPagesDisplayed={2}
						pageRangeDisplayed={perPage}
						onPageChange={this.handlePageClick}
						containerClassName={'pagination'}
						activeClassName={'active'}
					/>
				</div>
				<div className="mainContainer">
					<div>
						{pageView.map((message, idx) => {
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
			</>
		);
	}
}

export default Messages;
