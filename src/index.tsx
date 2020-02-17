import React from 'react';
import ReactDOM from 'react-dom';
import MessagesContainer from './components/MessagesContainer';

ReactDOM.render(
	<MessagesContainer perPage={5} />,
	document.getElementById('root')
);
