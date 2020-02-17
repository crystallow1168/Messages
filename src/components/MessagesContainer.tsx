import React, { Component } from 'react';
import Pagination from 'rc-pagination';

import Message from './Message';

import { messages as data } from '../../data.json';

import '../styles/MessagesContainer.css';
import 'rc-pagination/assets/index.css';

interface MessagesContainerProps {
	perPage: number;
}

interface MessagesContainerState {
	offset: number;
	messages: MessageType[];
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
		currentPage: 1,
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

	// Move view away from currently viewed empty page
	handleEmptyPage = () => {
		let { currentPage, messages } = this.state;
		let { perPage } = this.props;
		const pageCount = Math.ceil(messages.length / 5);

		if (this.isPageEmpty() === true) {
			if (currentPage > pageCount) {
				const newCurrentPage = currentPage - 1;
				this.setState(
					{
						currentPage: newCurrentPage,
						offset: newCurrentPage * perPage
					},
					() => this.handlePageClick(newCurrentPage)
				);
			}
		} else this.handleMessagesForCurrentPage();
	};

	// delete selected message
	deleteMessage = (uniqueID: string): void => {
		let { messages } = this.state;
		const copyMessages = [...messages];
		const idx = messages.findIndex(message => message.sentAt === uniqueID);

		copyMessages.splice(idx, 1);

		this.setState(
			{
				messages: copyMessages
			},
			() => this.handleEmptyPage()
		);
	};

	// handle view to clicked page
	handlePageClick = (selectedPage: any) => {
		const { perPage } = this.props;
		const offset = (selectedPage - 1) * perPage;

		this.setState(
			{
				currentPage: selectedPage,
				offset
			},
			() => this.handleMessagesForCurrentPage()
		);
	};

	// find messages for current page
	handleMessagesForCurrentPage() {
		const { offset, messages } = this.state;
		const { perPage } = this.props;

		let handleMessagesForCurrentPage = messages.slice(offset, offset + perPage);
		this.setState({ currentPageView: handleMessagesForCurrentPage });
	}

	// // to check if page is empty
	isPageEmpty() {
		const { messages } = this.state;
		const { perPage } = this.props;

		if (messages.length % perPage === 0) {
			return true;
		}
		return false;
	}

	render() {
		const { currentPageView, currentPage, messages } = this.state;
		const { perPage } = this.props;

		return (
			<>
				<div className="paginationContainer">
					<Pagination
						defaultCurrent={0}
						current={currentPage}
						defaultPageSize={perPage}
						onChange={this.handlePageClick}
						hideOnSinglePage={true}
						total={messages.length}
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
