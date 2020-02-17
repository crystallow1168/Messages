import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import '../styles/Messages.css';
import Message from './Message';

import { messages as data } from '../../data.json';

interface MessagesContainerProps {
	perPage: number;
}

interface MessagesContainerState {
	offset: number;
	messages: MessageType[];
	pageCount: number;
	currentPage: number;
	currentPageView: MessageType[];
}

export type MessageType = {
	sentAt: string;
	uuid: string;
	content: string;
	senderUuid: string;
};

class MessagesContainer extends Component<MessagesContainerProps> {
	state: MessagesContainerState = {
		offset: 0,
		messages: [],
		pageCount: Math.ceil(data.length / 5),
		currentPage: 0,
		currentPageView: []
	};

	componentDidMount() {
		this.filtered(data);
	}

	// filter data to remove duplicate messages
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

		// sorting messages by earliest to latest sentAt
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

	// delete current message
	deleteMessage = (uniqueID: string): void => {
		let { currentPage, pageCount, messages } = this.state;
		let { perPage } = this.props;
		const copyMessages = [...messages];
		const idx = messages.findIndex(message => message.sentAt === uniqueID);
		copyMessages.splice(idx, 1);

		// remove page if last page is empty
		if (this.isPageEmpty() === true) {
			this.setState(
				{
					messages: copyMessages,
					pageCount: Math.ceil(copyMessages.length / perPage)
				},
				() => this.handleMessagesForCurrentPage()
			);

			let offset = Math.ceil((currentPage - 2) * perPage);
			if (currentPage > pageCount - 2) {
				this.setState({ currentPage: currentPage - 1, offset }, () => {
					const page: { selected: number } = {
						selected: this.state.currentPage
					};
					this.handlePageClick(page);
				});
			}
		} else {
			this.setState(
				{
					messages: copyMessages
				},
				() => this.handleMessagesForCurrentPage()
			);
		}
	};

	// handle view to clicked page
	handlePageClick = (page: any) => {
		const { perPage } = this.props;

		let selected = page.selected;
		let offset = Math.ceil(selected * perPage);

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

	// find messages for current page
	handleMessagesForCurrentPage() {
		const { offset, messages } = this.state;
		const { perPage } = this.props;

		let handleMessagesForCurrentPage = messages.slice(offset, offset + perPage);
		this.setState({ currentPageView: handleMessagesForCurrentPage });
	}

	// to check if page is empty
	isPageEmpty() {
		const { messages, pageCount } = this.state;

		if (messages.length % pageCount === 0) {
			return true;
		}

		return false;
	}

	render() {
		const { currentPageView, pageCount } = this.state;
		const { perPage } = this.props;

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
						{currentPageView.map((message, idx) => {
							return (
								<Message
									message={message}
									key={idx}
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

export default MessagesContainer;
