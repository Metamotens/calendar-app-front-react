import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CalendarApp } from './CalendarApp';
import { store } from './components/store/store';

import './styles.css';

ReactDOM.render(
	<Provider store={store}>
		<CalendarApp />
	</Provider>,
	document.getElementById('root')
);
