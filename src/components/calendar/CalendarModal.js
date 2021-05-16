import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../actions/ui';
import {
	eventAddNew,
	eventClearActiveEvent,
	eventUpdated,
} from '../actions/events';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};
Modal.setAppElement('#root');

const nowDate = moment().minutes(0).second(0).add(1, 'hours');
const nowPlusDate = nowDate.clone().add(1, 'hours');
const initForm = {
	title: '',
	notes: '',
	start: nowDate.toDate(),
	end: nowPlusDate.toDate(),
};

export const CalendarModal = () => {
	const { modalOpen } = useSelector(state => state.ui);
	const { activeEvent } = useSelector(state => state.calendar);
	const dispatch = useDispatch();

	const [startDate, setstartDate] = useState(nowDate.toDate());
	const [endDate, setEndDate] = useState(nowPlusDate.toDate());
	const [titleValid, settitleValid] = useState(true);

	const [formValues, setformValues] = useState(initForm);

	const { title, notes, start, end } = formValues;

	useEffect(() => {
		activeEvent ? setformValues(activeEvent) : setformValues(initForm);
	}, [activeEvent, setformValues]);

	const handleInputChange = ({ target }) => {
		setformValues({
			...formValues,
			[target.name]: target.value,
		});
	};

	const handleSubmit = e => {
		e.preventDefault();

		const formStart = moment(start);
		const formEnd = moment(end);

		if (formStart.isSameOrAfter(formEnd)) {
			Swal.fire(
				'Error',
				'La fecha fin debe ser mayor a la fecha de inicio',
				'error'
			);
			return;
		}

		if (title.trim().length < 2) {
			return settitleValid(false);
		}

		if (activeEvent) {
			dispatch(eventUpdated(formValues));
		} else {
			dispatch(
				eventAddNew({
					...formValues,
					id: new Date().getTime(),
				})
			);
		}

		settitleValid(true);
		closeModal();
	};

	const closeModal = () => {
		dispatch(uiCloseModal());
		dispatch(eventClearActiveEvent());
		setformValues(initForm);
	};

	const handleStartDateChange = e => {
		setstartDate(e);
		setformValues({
			...formValues,
			start: e,
		});
	};

	const handleEndDateChange = e => {
		setEndDate(e);
		setformValues({
			...formValues,
			end: e,
		});
	};

	return (
		<Modal
			isOpen={modalOpen}
			onRequestClose={closeModal}
			//onAfterOpen={afterOpenModal}
			//onRequestClose={closeModal}
			style={customStyles}
			className='modal'
			closeTimeoutMS={200}
			overlayClassName='modal-fondo'>
			<h1> {(activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
			<hr />
			<form className='container' onSubmit={handleSubmit}>
				<div className='form-group'>
					<label>Fecha y hora inicio</label>
					<DateTimePicker
						onChange={handleStartDateChange}
						value={startDate}
						className='form-control'
					/>
				</div>

				<div className='form-group'>
					<label>Fecha y hora fin</label>
					<DateTimePicker
						onChange={handleEndDateChange}
						value={endDate}
						minDate={startDate}
						className='form-control'
					/>
				</div>

				<hr />
				<div className='form-group'>
					<label>Titulo y notas</label>
					<input
						type='text'
						className='form-control'
						placeholder='Título del evento'
						name='title'
						autoComplete='off'
						value={title}
						onChange={handleInputChange}
					/>
					<small id='emailHelp' className='form-text text-muted'>
						Una descripción corta
					</small>
				</div>

				<div className='form-group'>
					<textarea
						type='text'
						className='form-control'
						placeholder='Notas'
						rows='5'
						name='notes'
						value={notes}
						onChange={handleInputChange}></textarea>
					<small id='emailHelp' className='form-text text-muted'>
						Información adicional
					</small>
				</div>

				<button type='submit' className='btn btn-outline-primary btn-block'>
					<i className='far fa-save'></i>
					<span> Guardar</span>
				</button>
			</form>
		</Modal>
	);
};
