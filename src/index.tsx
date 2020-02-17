import React from 'react';
import ReactDOM from 'react-dom';
import Messages from './components/MessagesContainer';

ReactDOM.render(<Messages perPage={5} />, document.getElementById('root'));
