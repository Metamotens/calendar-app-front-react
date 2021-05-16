import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';

import { NavBar } from '../ui/NavBar';
import { messages } from '../helpers/calendar-messages-es';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../actions/ui';
import { useDispatch, useSelector } from 'react-redux';
import { eventClearActiveEvent, eventSetActive } from '../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
	const dispatch = useDispatch();
	const { events, activeEvent } = useSelector(state => state.calendar);

	const [lastView, setlastView] = useState(
		localStorage.getItem('lastView') || ''
	);

	const onDoubleClickEvent = e => {
		dispatch(uiOpenModal());
	};

	const onSelectEvent = e => {
		dispatch(eventSetActive(e));
	};

	const onSelectSlot = (e) => {
		dispatch(eventClearActiveEvent())
	} 

	const onViewChange = e => {
		setlastView(e);
		localStorage.setItem('lastView', e);
	};

	const eventStyleGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: '#367CF7',
			borderRadius: '0px',
			opacity: 0.8,
			display: 'block',
			color: 'white',
		};

		return { style };
	};

	return (
		<div className='calendar-screen'>
			<NavBar />
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor='start'
				endAccessor='end'
				messages={messages}
				eventPropGetter={eventStyleGetter}
				onDoubleClickEvent={onDoubleClickEvent}
				onSelectEvent={onSelectEvent}
				onView={onViewChange}
				view={lastView}
				onSelectSlot={onSelectSlot}
				selectable={true}
				components={{ event: CalendarEvent }}
			/>

			<AddNewFab />
			{
				(activeEvent) && <DeleteEventFab />
			}
			<CalendarModal />
		</div>
	);
};
